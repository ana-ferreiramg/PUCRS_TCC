import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ProductCreateArgs): Promise<Product> {
    return this.prismaService.product.create(createDto);
  }

  findUnique(
    findUniqueDto: Prisma.ProductFindUniqueArgs,
  ): Promise<Product | null> {
    return this.prismaService.product.findUnique(findUniqueDto);
  }

  findFirst(
    findFirstDto: Prisma.ProductFindFirstArgs,
  ): Promise<Product | null> {
    return this.prismaService.product.findFirst(findFirstDto);
  }

  findAll(findManyDto: Prisma.ProductFindManyArgs): Promise<Product[]> {
    return this.prismaService.product.findMany(findManyDto);
  }

  update(updateDto: Prisma.ProductUpdateArgs): Promise<Product> {
    return this.prismaService.product.update(updateDto);
  }

  remove(deleteDto: Prisma.ProductDeleteArgs): Promise<Product> {
    return this.prismaService.product.delete(deleteDto);
  }

  count(countDto: Prisma.ProductCountArgs): Promise<number> {
    return this.prismaService.product.count(countDto);
  }
}
