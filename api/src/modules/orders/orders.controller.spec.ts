import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  const ordersService: Partial<Record<keyof OrdersService, jest.Mock>> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created order', async () => {
      const dto: CreateOrderDto = {
        client: 'Mesa 1',
        companyId: 'comp-uuid',
        userId: 'user-uuid',
        orderItems: [
          {
            productId: 'prod-uuid',
            quantity: 2,
          },
        ],
        notes: 'Sem cebola',
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
      };

      const expectedResponse = {
        id: 'order-id',
        ...dto,
        totalAmount: 39.9,
        createdAt: new Date(),
      };

      ordersService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResponse);
      expect(ordersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [{ id: '1' }, { id: '2' }];
      ordersService.findAll.mockResolvedValue(orders);

      const result = await controller.findAll();
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      const order = { id: '123', tableNumber: 1 };
      ordersService.findOne.mockResolvedValue(order);

      const result = await controller.findOne('123');
      expect(result).toEqual(order);
      expect(ordersService.findOne).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should call service.update and return updated order', async () => {
      const orderId = 'order-id';
      const dto: UpdateOrderDto = {
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        notes: 'Pedido finalizado',
        orderItems: [
          { id: 'item-1', productId: 'prod-1', quantity: 2, price: 10 },
          { id: 'item-2', productId: 'prod-2', quantity: 1, price: 20 },
        ],
      };

      const expectedUpdatedOrder = {
        id: orderId,
        ...dto,
        totalAmount: 40,
      };

      ordersService.update.mockResolvedValue(expectedUpdatedOrder);

      const result = await controller.update(orderId, dto);

      expect(result).toEqual(expectedUpdatedOrder);
      expect(ordersService.update).toHaveBeenCalledWith(orderId, dto);
    });

    it('should throw if service.update throws', async () => {
      ordersService.update.mockRejectedValue(
        new Error('Erro ao atualizar pedido'),
      );

      const dto: UpdateOrderDto = {
        status: OrderStatus.CANCELED,
        paymentStatus: PaymentStatus.PAID,
        notes: 'Erro forçado',
        orderItems: [],
      };

      await expect(controller.update('some-id', dto)).rejects.toThrow(
        'Erro ao atualizar pedido',
      );
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      ordersService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('123')).resolves.toBeUndefined();
      expect(ordersService.remove).toHaveBeenCalledWith('123');
    });
  });
});
