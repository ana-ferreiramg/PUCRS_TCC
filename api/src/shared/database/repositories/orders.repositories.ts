import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.OrderCreateArgs): Promise<Order> {
    return this.prismaService.order.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.OrderFindUniqueArgs): Promise<Order | null> {
    return this.prismaService.order.findUnique(findUniqueDto);
  }

  findAll(findManyDto: Prisma.OrderFindManyArgs): Promise<Order[]> {
    return this.prismaService.order.findMany(findManyDto);
  }

  update(updateDto: Prisma.OrderUpdateArgs): Promise<Order> {
    return this.prismaService.order.update(updateDto);
  }

  remove(deleteDto: Prisma.OrderDeleteArgs): Promise<Order> {
    return this.prismaService.order.delete(deleteDto);
  }

  count(countDto: Prisma.OrderCountArgs): Promise<number> {
    return this.prismaService.order.count(countDto);
  }
}
