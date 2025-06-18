import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;

    const isPasswordValid = await compare(plainPassword, user.password);
    if (!isPasswordValid) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(user: AuthenticatedUser): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
