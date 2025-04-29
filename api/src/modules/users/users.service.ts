import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UsersRepository } from '@shared/database/repositories/users.repositories';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  // Criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role, companyId } = createUserDto;

    const emailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('Este email já está sendo usado.');
    }

    // Apenas SUPER_ADMIN pode ser criado sem companyId
    if (role !== UserRole.SUPER_ADMIN && !companyId) {
      throw new BadRequestException(
        'Usuários com papéis ADMIN ou WAITER devem estar vinculados a uma empresa.',
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyId: companyId || null,
      },
    });

    return user;
  }

  // Encontrar todos os usuários
  async findAll(): Promise<User[]> {
    return this.usersRepo.findAll({});
  }

  // Encontrar um usuário por ID
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Atualizar um usuário
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepo.update({
      where: { id },
      data: updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Remover um usuário
  async remove(id: string): Promise<User> {
    const user = await this.usersRepo.remove({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
