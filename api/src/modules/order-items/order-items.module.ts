import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';

@Module({
  controllers: [],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}
