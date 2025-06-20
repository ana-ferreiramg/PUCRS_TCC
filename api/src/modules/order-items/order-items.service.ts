import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderItem, Product } from '@prisma/client';
import { OrderItemsRepository } from '@shared/database/repositories/orderItems.repositories';
import { ProductsRepository } from '@shared/database/repositories/products.repositories';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly orderItemsRepo: OrderItemsRepository,
    private readonly productsRepo: ProductsRepository,
  ) {}

  async create(
    createOrderItemDto: CreateOrderItemDto,
    orderId: string,
  ): Promise<OrderItem> {
    const { productId, quantity } = createOrderItemDto;

    try {
      const product: Product | null = await this.productsRepo.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new HttpException(
          'Produto não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.orderItemsRepo.create({
        data: {
          orderId,
          productId,
          quantity,
          price: product.price,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Erro ao criar o item do pedido: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<OrderItem[]> {
    try {
      return await this.orderItemsRepo.findAll({});
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar todos os itens do pedido: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<OrderItem> {
    try {
      const item = await this.orderItemsRepo.findUnique({ where: { id } });

      if (!item) {
        throw new HttpException(
          `Item com ID ${id} não encontrado.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return item;
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar item do pedido: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const { productId, quantity } = updateOrderItemDto;

    try {
      const product: Product | null = await this.productsRepo.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new HttpException(
          'Produto não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedItem = await this.orderItemsRepo.update({
        where: { id },
        data: {
          quantity,
          price: product.price,
          productId,
        },
      });

      if (!updatedItem) {
        throw new HttpException(
          `Item com ID ${id} não encontrado.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedItem;
    } catch (error) {
      throw new HttpException(
        `Erro ao atualizar o item do pedido ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<OrderItem> {
    try {
      const deletedItem = await this.orderItemsRepo.remove({ where: { id } });

      if (!deletedItem) {
        throw new HttpException(
          `Item com ID ${id} não encontrado.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return deletedItem;
    } catch (error) {
      throw new HttpException(
        `Erro ao remover o item do pedido ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeManyByOrderId(orderId: string): Promise<string> {
    try {
      await this.orderItemsRepo.removeManyByOrderId(orderId);
      return `Itens da ordem com ID ${orderId} deletados com sucesso.`;
    } catch (error) {
      throw new HttpException(
        `Erro ao remover os itens da ordem com ID ${orderId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
