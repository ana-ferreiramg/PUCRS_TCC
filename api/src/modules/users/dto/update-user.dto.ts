import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `O papel deve ser um valor válido (${Object.values(UserRole).join(', ')}).`,
  })
  role?: UserRole;
}
