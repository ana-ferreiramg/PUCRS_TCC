import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { DatabaseModule } from '@shared/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UsersModule,
    CompaniesModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
