import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service'; // Ajuste o caminho conforme seu projeto
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call usersService.findOneByEmail, usersService.create and authService.login', async () => {
      const dto: SignupDto = {
        name: 'Ana Ferreira',
        email: 'ana@example.com',
        password: '123456',
        role: UserRole.WAITER,
      };

      mockUsersService.findOneByEmail.mockResolvedValue(null); // email não existe
      mockUsersService.create.mockResolvedValue({ id: 'user-id', ...dto }); // simula criação
      mockAuthService.login.mockResolvedValue({ accessToken: 'fake-token' });

      const result = await controller.signup(dto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(mockAuthService.login).toHaveBeenCalledWith({
        id: 'user-id',
        ...dto,
      });
      expect(result).toEqual({ accessToken: 'fake-token' });
    });

    it('should throw if email already exists', async () => {
      const dto: SignupDto = {
        name: 'Ana Ferreira',
        email: 'ana@example.com',
        password: '123456',
        role: UserRole.WAITER,
      };

      mockUsersService.findOneByEmail.mockResolvedValue({ id: 'some-id' }); // email já existe

      // no controller, o erro é lançado na verificação, sem chamar create
      await expect(controller.signup(dto)).rejects.toThrow(
        'Email já cadastrado',
      );
    });
  });

  describe('login', () => {
    it('should call authService.validateUser and authService.login', async () => {
      const loginDto = {
        email: 'ana@example.com',
        password: '123456',
      };

      const mockUser = { id: 'user-id', email: loginDto.email };
      mockAuthService.validateUser = jest.fn().mockResolvedValue(mockUser);
      mockAuthService.login = jest
        .fn()
        .mockResolvedValue({ accessToken: 'token-login' });

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ accessToken: 'token-login' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto = {
        email: 'ana@example.com',
        password: 'wrong-password',
      };

      mockAuthService.validateUser = jest.fn().mockResolvedValue(null); // simula usuário inválido

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
