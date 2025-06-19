import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  const mockUser: User = {
    id: '1',
    name: 'Ana Ferreira',
    email: 'ana@example.com',
    password: 'hashed-password',
    role: UserRole.ADMIN,
    companyId: null,
  };

  beforeEach(async () => {
    mockUsersService = {
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockUser, name: 'Updated Name' }),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update the user if requester is self or admin', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const req = { user: { userId: '1', role: UserRole.ADMIN } };

      const result = await controller.update('1', dto, req);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', dto, {
        id: '1',
        role: UserRole.ADMIN,
        userId: '1',
        email: undefined,
      });
      expect(result.name).toEqual('Updated Name');
    });
  });
});
