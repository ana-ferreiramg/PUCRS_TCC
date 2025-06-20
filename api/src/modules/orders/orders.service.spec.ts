import { OrderItemsService } from '@modules/order-items/order-items.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';
import { OrdersRepository } from '@shared/database/repositories/orders.repositories';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepo: Partial<Record<keyof OrdersRepository, jest.Mock>>;
  let orderItemsService: Partial<Record<keyof OrderItemsService, jest.Mock>>;
  let ordersGateway: Partial<Record<keyof OrdersGateway, jest.Mock>>;

  beforeEach(async () => {
    ordersRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    orderItemsService = {
      create: jest.fn(),
      update: jest.fn(),
      removeManyByOrderId: jest.fn(),
    };

    ordersGateway = {
      emitOrderCreated: jest.fn(),
      emitOrderUpdated: jest.fn(),
      emitOrderDeleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: ordersRepo },
        { provide: OrderItemsService, useValue: orderItemsService },
        { provide: OrdersGateway, useValue: ordersGateway },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('should create order and order items, calculate totalAmount and return full order', async () => {
      const createDto: CreateOrderDto = {
        client: 'Client 1',
        companyId: 'company-1',
        userId: 'user-1',
        notes: 'No onions',
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
        orderItems: [
          { productId: 'prod-1', quantity: 2 },
          { productId: 'prod-2', quantity: 1 },
        ],
      };

      type OrderWithItems = Order & {
        orderItems: Array<{
          id: string;
          productId: string;
          quantity: number;
          price: number;
          product: { name: string; description: string; imageUrl: string };
        }>;
        user: { name: string };
      };

      ordersRepo.create.mockResolvedValue({
        id: 'order-1',
        client: createDto.client,
        status: createDto.status,
        paymentStatus: createDto.paymentStatus,
        paymentMethod: createDto.paymentMethod,
        notes: createDto.notes,
        totalAmount: 0,
        companyId: createDto.companyId,
        userId: createDto.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      orderItemsService.create.mockImplementation(async (item, orderId) => ({
        ...item,
        id: `item-${item.productId}`,
        orderId,
        price: item.productId === 'prod-1' ? 10 : 15,
      }));

      ordersRepo.update.mockResolvedValue({
        id: 'order-1',
        totalAmount: 35,
      });

      ordersRepo.findUnique.mockResolvedValue({
        id: 'order-1',
        client: createDto.client,
        status: createDto.status,
        paymentStatus: createDto.paymentStatus,
        paymentMethod: createDto.paymentMethod,
        notes: createDto.notes,
        totalAmount: 35,
        companyId: createDto.companyId,
        userId: createDto.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            id: 'item-prod-1',
            productId: 'prod-1',
            quantity: 2,
            price: 10,
            product: {
              name: 'Product 1',
              description: 'Desc 1',
              imageUrl: 'url1',
            },
          },
          {
            id: 'item-prod-2',
            productId: 'prod-2',
            quantity: 1,
            price: 15,
            product: {
              name: 'Product 2',
              description: 'Desc 2',
              imageUrl: 'url2',
            },
          },
        ],
        user: { name: 'User 1' },
      });

      const result = (await service.create(createDto)) as OrderWithItems;

      expect(ordersRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            client: createDto.client,
            status: createDto.status,
            paymentStatus: createDto.paymentStatus,
            paymentMethod: createDto.paymentMethod,
            notes: createDto.notes,
            totalAmount: 0,
            company: { connect: { id: createDto.companyId } },
            user: { connect: { id: createDto.userId } },
          }),
        }),
      );

      expect(orderItemsService.create).toHaveBeenCalledTimes(2);
      expect(ordersRepo.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { totalAmount: 35 },
      });

      expect(ordersRepo.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
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

      expect(result.totalAmount).toBe(35);
      expect(result.orderItems).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const fakeOrders = [{ id: '1' }, { id: '2' }];
      ordersRepo.findAll.mockResolvedValue(fakeOrders);

      const result = await service.findAll();

      expect(ordersRepo.findAll).toHaveBeenCalledWith({
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

      expect(result).toEqual(fakeOrders);
    });

    it('should throw HttpException on findAll error', async () => {
      ordersRepo.findAll.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return order when found', async () => {
      const fakeOrder = { id: 'order-1', client: 'Client 1' };
      ordersRepo.findUnique.mockResolvedValue(fakeOrder);

      const result = await service.findOne('order-1');

      expect(ordersRepo.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: {
          orderItems: { include: { product: true } },
          user: true,
          company: true,
        },
      });

      expect(result).toEqual(fakeOrder);
    });

    it('should throw 404 if order not found', async () => {
      ordersRepo.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        HttpException,
      );
      await expect(service.findOne('missing-id')).rejects.toThrow(
        'Ordem com ID missing-id não encontrada.',
      );
    });

    it('should throw HttpException on findOne error', async () => {
      ordersRepo.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne('id')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update order and orderItems and recalculate totalAmount', async () => {
      const orderId = 'order-1';
      const updateDto: UpdateOrderDto = {
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        notes: 'Finalized',
        orderItems: [
          { id: 'item-1', productId: 'prod-1', quantity: 2, price: 10 },
          { id: 'item-2', productId: 'prod-2', quantity: 1, price: 20 },
        ],
      };

      ordersRepo.update.mockResolvedValueOnce({ id: orderId, ...updateDto });

      orderItemsService.update.mockImplementation(async (id, item) => ({
        id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        orderId,
      }));

      const totalAmount = 10 * 2 + 20 * 1;

      ordersRepo.update.mockResolvedValueOnce({ id: orderId, totalAmount });

      ordersRepo.findUnique.mockResolvedValue({
        id: orderId,
        status: updateDto.status,
        paymentStatus: updateDto.paymentStatus,
        notes: updateDto.notes,
        totalAmount,
        orderItems: [
          {
            id: 'item-1',
            productId: 'prod-1',
            quantity: 2,
            price: 10,
            product: {
              name: 'Product 1',
              description: 'Desc 1',
              imageUrl: 'img1.jpg',
            },
          },
          {
            id: 'item-2',
            productId: 'prod-2',
            quantity: 1,
            price: 20,
            product: {
              name: 'Product 2',
              description: 'Desc 2',
              imageUrl: 'img2.jpg',
            },
          },
        ],
        user: {
          name: 'User Test',
        },
      });

      const result = await service.update(orderId, updateDto);

      expect(ordersRepo.update).toHaveBeenNthCalledWith(1, {
        where: { id: orderId },
        data: {
          status: updateDto.status,
          paymentStatus: updateDto.paymentStatus,
          notes: updateDto.notes,
        },
      });

      expect(orderItemsService.update).toHaveBeenCalledTimes(2);
      expect(orderItemsService.update).toHaveBeenCalledWith(
        'item-1',
        updateDto.orderItems[0],
      );
      expect(orderItemsService.update).toHaveBeenCalledWith(
        'item-2',
        updateDto.orderItems[1],
      );

      expect(orderItemsService.create).not.toHaveBeenCalled();

      expect(ordersRepo.update).toHaveBeenNthCalledWith(2, {
        where: { id: orderId },
        data: { totalAmount },
      });

      expect(ordersRepo.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
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

      expect(result.id).toBe(orderId);
      expect(result.totalAmount).toBe(40);
    });

    it('should throw HttpException on update error', async () => {
      ordersRepo.update.mockRejectedValue(new Error('DB error'));

      await expect(
        service.update('id', {
          status: OrderStatus.CANCELED,
          paymentStatus: PaymentStatus.PAID,
          notes: '',
          orderItems: [],
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove order and orderItems', async () => {
      const orderId = 'order-1';

      ordersRepo.findUnique.mockResolvedValue({ id: orderId });
      orderItemsService.removeManyByOrderId.mockResolvedValue(undefined);
      ordersRepo.remove.mockResolvedValue({ id: orderId });

      const result = await service.remove(orderId);

      expect(ordersRepo.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(orderItemsService.removeManyByOrderId).toHaveBeenCalledWith(
        orderId,
      );
      expect(ordersRepo.remove).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(result).toEqual({ id: orderId });
    });

    it('should throw 404 if order not found on remove', async () => {
      ordersRepo.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(HttpException);
      await expect(service.remove('missing-id')).rejects.toThrow(
        'Ordem com ID missing-id não encontrada.',
      );
    });

    it('should throw HttpException on remove error', async () => {
      ordersRepo.findUnique.mockResolvedValue({ id: 'order-1' });
      orderItemsService.removeManyByOrderId.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.remove('order-1')).rejects.toThrow(HttpException);
    });
  });
});
