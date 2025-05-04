import { Module } from '@nestjs/common';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

@Module({
  providers: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
