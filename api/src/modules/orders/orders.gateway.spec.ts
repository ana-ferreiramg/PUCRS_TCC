import { Test, TestingModule } from '@nestjs/testing';
import { Order } from '@prisma/client';
import { Server } from 'socket.io';
import { OrdersGateway } from './orders.gateway';

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersGateway],
    }).compile();

    gateway = module.get<OrdersGateway>(OrdersGateway);

    // mock do server emit
    gateway.server = {
      emit: jest.fn(),
    } as unknown as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit orderCreated event', () => {
    const order = {
      id: 'order-1',
      client: 'Cliente A',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
      notes: '',
      totalAmount: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      companyId: 'company-1',
      userId: 'user-1',
    } as Order;

    gateway.emitOrderCreated(order);
    expect(gateway.server.emit).toHaveBeenCalledWith('orderCreated', order);
  });

  it('should emit orderUpdated event', () => {
    const order = { id: 'order-1' } as Order;
    gateway.emitOrderUpdated(order);
    expect(gateway.server.emit).toHaveBeenCalledWith('orderUpdated', order);
  });

  it('should emit orderDeleted event', () => {
    gateway.emitOrderDeleted('order-1');
    expect(gateway.server.emit).toHaveBeenCalledWith('orderDeleted', {
      id: 'order-1',
    });
  });
});
