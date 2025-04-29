import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ValidateIf((dto) => dto.role !== UserRole.SUPER_ADMIN)
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório e não pode estar vazio.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório e não pode estar vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória e não pode estar vazia.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(20, { message: 'A senha pode ter no máximo 20 caracteres.' })
  password: string;

  @IsEnum(UserRole, {
    message: `O papel deve ser um valor válido (${Object.values(UserRole).join(', ')}).`,
  })
  role: UserRole;
}
