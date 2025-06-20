import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsOptional()
  orderId?: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  price?: number;
}
