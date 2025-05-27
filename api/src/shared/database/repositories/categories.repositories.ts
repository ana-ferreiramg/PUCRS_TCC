import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.CategoryCreateArgs): Promise<Category> {
    return this.prismaService.category.create(createDto);
  }

  findUnique(
    findUniqueDto: Prisma.CategoryFindUniqueArgs,
  ): Promise<Category | null> {
    return this.prismaService.category.findUnique(findUniqueDto);
  }

  findFirst(
    findFirstDto: Prisma.CategoryFindFirstArgs,
  ): Promise<Category | null> {
    return this.prismaService.category.findFirst(findFirstDto);
  }

  findAll(findManyDto: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prismaService.category.findMany(findManyDto);
  }

  update(updateDto: Prisma.CategoryUpdateArgs): Promise<Category> {
    return this.prismaService.category.update(updateDto);
  }

  remove(deleteDto: Prisma.CategoryDeleteArgs): Promise<Category> {
    return this.prismaService.category.delete(deleteDto);
  }

  count(countDto: Prisma.CategoryCountArgs): Promise<number> {
    return this.prismaService.category.count(countDto);
  }
}
