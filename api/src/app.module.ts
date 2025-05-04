import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { DatabaseModule } from '@shared/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
