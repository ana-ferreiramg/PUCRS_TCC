import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { CompaniesRepository } from '@shared/database/repositories/companies.repositories';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService, CompaniesRepository],
})
export class CompaniesModule {}
