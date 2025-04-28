import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { CompaniesRepository } from '@shared/database/repositories/companies.repositories';
import { SlugifyService } from '@shared/utils/slugify.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    PrismaService,
    CompaniesRepository,
    SlugifyService,
  ],
})
export class CompaniesModule {}
