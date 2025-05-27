import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.OrderItemCreateArgs): Promise<OrderItem> {
    return this.prismaService.orderItem.create(createDto);
  }

  findUnique(
    findUniqueDto: Prisma.OrderItemFindUniqueArgs,
  ): Promise<OrderItem | null> {
    return this.prismaService.orderItem.findUnique(findUniqueDto);
  }

  findAll(findManyDto: Prisma.OrderItemFindManyArgs): Promise<OrderItem[]> {
    return this.prismaService.orderItem.findMany(findManyDto);
  }

  update(updateDto: Prisma.OrderItemUpdateArgs): Promise<OrderItem> {
    return this.prismaService.orderItem.update(updateDto);
  }

  remove(deleteDto: Prisma.OrderItemDeleteArgs): Promise<OrderItem> {
    return this.prismaService.orderItem.delete(deleteDto);
  }

  count(countDto: Prisma.OrderItemCountArgs): Promise<number> {
    return this.prismaService.orderItem.count(countDto);
  }

  removeManyByOrderId(orderId: string): Promise<void> {
    return this.prismaService.orderItem
      .deleteMany({
        where: { orderId },
      })
      .then(() => {
        return;
      })
      .catch((error) => {
        throw new HttpException(
          `Erro ao deletar itens da ordem: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
