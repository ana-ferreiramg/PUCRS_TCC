import { OrderItemsService } from '@modules/order-items/order-items.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { OrdersRepository } from '@shared/database/repositories/orders.repositories';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly orderItemsService: OrderItemsService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems, ...orderData } = createOrderDto;

    try {
      const order = await this.ordersRepo.create({
        data: {
          client: orderData.client,
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
          totalAmount: 0,

          company: {
            connect: { id: orderData.companyId },
          },
          user: {
            connect: { id: orderData.userId },
          },
        },
      });

      const createdOrderItems = await Promise.all(
        orderItems.map(async (item) => {
          return await this.orderItemsService.create(item, order.id);
        }),
      );

      const totalAmount = createdOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await this.ordersRepo.update({
        where: { id: order.id },
        data: {
          totalAmount,
        },
      });

      const finalOrder = await this.ordersRepo.findUnique({
        where: { id: order.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: { name: true, description: true, imageUrl: true },
              },
            },
          },
          user: { select: { name: true } },
        },
      });

      this.ordersGateway.emitOrderCreated(finalOrder);

      return finalOrder;
    } catch (error) {
      throw new HttpException(
        `Erro ao criar a ordem: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.ordersRepo.findAll({
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                  category: { select: { name: true, icon: true } },
                  description: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar todas as ordens: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.ordersRepo.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
          company: true,
        },
      });

      if (!order) {
        throw new HttpException(
          `Ordem com ID ${id} não encontrada.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return order;
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar a ordem: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { orderItems, ...orderData } = updateOrderDto;

    try {
      await this.ordersRepo.update({
        where: { id },
        data: {
          ...orderData,
        },
      });

      const updatedOrderItems = await Promise.all(
        orderItems.map(async (item) => {
          if (item.id) {
            return await this.orderItemsService.update(item.id, item);
          } else {
            return await this.orderItemsService.create(item, id);
          }
        }),
      );

      const totalAmount = updatedOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await this.ordersRepo.update({
        where: { id },
        data: {
          totalAmount,
        },
      });

      // Retorna a ordem completa com relacionamentos
      const updatedOrder = await this.ordersRepo.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      this.ordersGateway.emitOrderUpdated(updatedOrder);

      return updatedOrder;
    } catch (error) {
      throw new HttpException(
        `Erro ao atualizar a ordem ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Order> {
    try {
      const existingOrder = await this.ordersRepo.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new HttpException(
          `Ordem com ID ${id} não encontrada.`,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.orderItemsService.removeManyByOrderId(id);

      await this.ordersRepo.remove({
        where: { id },
      });

      this.ordersGateway.emitOrderDeleted(id);

      return existingOrder;
    } catch (error) {
      throw new HttpException(
        `Erro ao remover a ordem com ID ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
