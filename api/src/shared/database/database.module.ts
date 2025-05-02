import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { CompaniesRepository } from './repositories/companies.repositories';
import { ProductsRepository } from './repositories/products.repository';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
    ProductsRepository,
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
    ProductsRepository,
  ],
})
export class DatabaseModule {}
