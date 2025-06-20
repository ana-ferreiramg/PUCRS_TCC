import { IsInt, IsNotEmpty, IsPositive, IsUUID, Min } from 'class-validator';
export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
