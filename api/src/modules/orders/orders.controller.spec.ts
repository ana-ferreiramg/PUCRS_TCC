import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
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

      mockOrdersService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResponse);
      expect(mockOrdersService.create).toHaveBeenCalledWith(dto);
    });
  });
});
