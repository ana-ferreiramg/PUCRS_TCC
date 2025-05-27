import { OrderItemsService } from '@modules/order-items/order-items.service';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway, OrderItemsService],
})
export class OrdersModule {}
