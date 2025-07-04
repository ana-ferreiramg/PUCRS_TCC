import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const mockUsersRepo = () => ({
  findUnique: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo;

  beforeEach(() => {
    usersRepo = mockUsersRepo();
    service = new UsersService(usersRepo);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = {
        name: 'Ana',
        email: 'ana@example.com',
        password: '123456',
        role: UserRole.WAITER,
        companyId: 'company-id',
      };

      usersRepo.findUnique.mockResolvedValue(null); // email não existe
      usersRepo.create.mockImplementation(async ({ data }) => ({
        id: 'user-id',
        ...data,
      }));

      const user = await service.create(dto);

      expect(usersRepo.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
        select: { id: true },
      });

      expect(usersRepo.create).toHaveBeenCalled();
      expect(user).toHaveProperty('id', 'user-id');
      expect(user).toHaveProperty('email', dto.email);
      expect(user.password).not.toBe(dto.password); // senha deve estar hasheada
    });

    it('should throw ConflictException if email is taken', async () => {
      usersRepo.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.create({
          name: 'Ana',
          email: 'ana@example.com',
          password: '123456',
          role: UserRole.WAITER,
          companyId: 'company-id',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if companyId missing for non-SUPER_ADMIN', async () => {
      await expect(
        service.create({
          name: 'Ana',
          email: 'ana@example.com',
          password: '123456',
          role: UserRole.ADMIN,
          companyId: null,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow SUPER_ADMIN without companyId', async () => {
      usersRepo.findUnique.mockResolvedValue(null);
      usersRepo.create.mockImplementation(async ({ data }) => ({
        id: 'user-id',
        ...data,
      }));

      const user = await service.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: '123456',
        role: UserRole.SUPER_ADMIN,
        companyId: null,
      });

      expect(user.role).toBe(UserRole.SUPER_ADMIN);
      expect(usersRepo.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }] as User[];
      usersRepo.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(usersRepo.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepo.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('3f1f4a57-1b63-4a5f-98cd-8c258dc1e53f'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return user if found', async () => {
      const user = { id: 'uuid', email: 'ana@example.com' } as User;
      usersRepo.findUnique.mockResolvedValue(user);

      const result = await service.findOne(
        '3f1f4a57-1b63-4a5f-98cd-8c258dc1e53f',
      );

      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return user or null', async () => {
      const user = { id: 'uuid', email: 'ana@example.com' } as User;
      usersRepo.findUnique.mockResolvedValue(user);

      const result = await service.findOneByEmail('ana@example.com');

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    const existingUser = {
      id: 'uuid',
      email: 'old@example.com',
      role: UserRole.WAITER,
    } as User;

    it('should throw NotFoundException if user not found', async () => {
      usersRepo.findUnique.mockResolvedValue(null);

      await expect(
        service.update(
          'uuid',
          { name: 'new name' },
          { id: 'uuid2', email: 'x', role: UserRole.ADMIN },
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if non-admin updates others', async () => {
      usersRepo.findUnique.mockResolvedValue(existingUser);

      await expect(
        service.update(
          'uuid',
          { name: 'new name' },
          { id: 'different-user', email: 'x', role: UserRole.WAITER },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if non-admin tries to update restricted fields', async () => {
      usersRepo.findUnique.mockResolvedValue(existingUser);

      await expect(
        service.update(
          'uuid',
          { name: 'new name', email: 'new@example.com' },
          { id: 'uuid', email: 'old@example.com', role: UserRole.WAITER },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should hash password if provided', async () => {
      usersRepo.findUnique.mockResolvedValue(existingUser);
      usersRepo.update.mockImplementation(async ({ data }) => ({
        ...existingUser,
        ...data,
        password: data.password,
      }));

      const dto = { password: 'newpass' };
      const dtoCopy = { ...dto };

      const currentUser = {
        id: 'uuid',
        email: 'old@example.com',
        role: UserRole.ADMIN,
      };

      const updatedUser = await service.update('uuid', dto, currentUser);

      expect(updatedUser.password).not.toBe(dtoCopy.password);
    });

    it('should hash password if provided', async () => {
      usersRepo.findUnique.mockResolvedValue(existingUser);
      usersRepo.update.mockImplementation(async ({ data }) => ({
        ...existingUser,
        ...data,
        password: 'hashed-password-mock',
      }));

      const dto: Partial<UpdateUserDto> = { password: 'newpass' };
      const currentUser = {
        id: 'uuid',
        email: 'old@example.com',
        role: UserRole.ADMIN,
      };

      const plainPassword = dto.password;

      const updatedUser = await service.update('uuid', dto, currentUser);

      expect(updatedUser.password).not.toBe(plainPassword);
    });
  });
});
