import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { DatabaseModule } from '@shared/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UsersModule,
    CompaniesModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
