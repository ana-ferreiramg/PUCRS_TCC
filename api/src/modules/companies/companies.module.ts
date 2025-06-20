import { Module } from '@nestjs/common';
import { SlugifyService } from '@shared/utils/slugify.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, SlugifyService],
})
export class CompaniesModule {}
