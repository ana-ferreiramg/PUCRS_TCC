import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CompaniesRepository } from './repositories/companies.repositories';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [PrismaService, UsersRepository, CompaniesRepository],
  exports: [PrismaService, UsersRepository, CompaniesRepository],
})
export class DatabaseModule {}
