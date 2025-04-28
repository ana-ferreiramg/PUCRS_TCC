import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
