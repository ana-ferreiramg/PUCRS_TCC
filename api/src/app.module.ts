import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [ConfigModule, UsersModule, CompaniesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
