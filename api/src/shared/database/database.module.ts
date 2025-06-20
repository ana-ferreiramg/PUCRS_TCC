import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoriesRepository } from './repositories/categories.repositories';
import { CompaniesRepository } from './repositories/companies.repositories';
import { OrderItemsRepository } from './repositories/orderItems.repositories';
import { OrdersRepository } from './repositories/orders.repositories';
import { ProductsRepository } from './repositories/products.repositories';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
  ],
})
export class DatabaseModule {}
