import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcryptjs';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: 'user-id',
    email: 'ana@example.com',
    password: 'hashed-password',
    role: 'WAITER',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    usersService = {
      findOneByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser('ana@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('ana@example.com', 'wrongpass');
      expect(result).toBeNull();
    });

    it('should return user data (without password) if credentials are valid', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('ana@example.com', '123456');
      expect(result).toEqual({
        id: 'user-id',
        email: 'ana@example.com',
        role: 'WAITER',
      });
    });
  });
});
