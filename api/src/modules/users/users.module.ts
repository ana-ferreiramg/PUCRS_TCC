import { Module } from '@nestjs/common';
import { UsersRepository } from '@shared/database/repositories/users.repositories';
import { PrismaService } from 'src/shared/database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepository],
})
export class UsersModule {}
