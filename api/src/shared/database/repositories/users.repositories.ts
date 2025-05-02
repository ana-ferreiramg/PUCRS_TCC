import { Injectable } from '@nestjs/common';
import { User, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.UserCreateArgs): Promise<User> {
    return this.prismaService.user.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prismaService.user.findUnique(findUniqueDto);
  }

  // Buscar todos os usuários
  findAll(findManyDto: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prismaService.user.findMany(findManyDto);
  }

  // Atualizar um usuário
  update(updateDto: Prisma.UserUpdateArgs): Promise<User> {
    return this.prismaService.user.update(updateDto);
  }

  // Deletar um usuário
  remove(deleteDto: Prisma.UserDeleteArgs): Promise<User> {
    return this.prismaService.user.delete(deleteDto);
  }
}
