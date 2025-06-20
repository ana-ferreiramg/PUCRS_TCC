import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UsersRepository } from '@shared/database/repositories/users.repositories';
import { isAdminRole } from '@shared/utils/role.utils';
import { hash } from 'bcryptjs';
import { isUUID } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
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
    return await this.usersRepo.findAll({});
  }

  // Encontrar um usuário por ID
  async findOne(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('O ID fornecido não é um UUID válido.');
    }

    const user = await this.usersRepo.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findUnique({
      where: { email },
    });
  }

  // Atualizar um usuário
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: AuthenticatedUser,
  ): Promise<User> {
    const existingUser = await this.usersRepo.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isSelf = currentUser.id === id;
    const isAdmin = isAdminRole(currentUser.role);

    if (!isAdmin) {
      if (!isSelf) {
        throw new ForbiddenException('Você só pode editar sua própria conta.');
      }

      const forbiddenFields = ['name', 'email', 'role', 'companyId'] as const;
      const triedToChangeRestricted = forbiddenFields.some(
        (field) => field in updateUserDto,
      );

      if (triedToChangeRestricted) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar nome, email, papel ou empresa.',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepo.update({
      where: { id },
      data: updateUserDto,
    });

    return updatedUser;
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
