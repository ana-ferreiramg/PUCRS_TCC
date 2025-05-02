import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { CompaniesRepository } from './repositories/companies.repositories';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    CategoriesRepository,
  ],
})
export class DatabaseModule {}
