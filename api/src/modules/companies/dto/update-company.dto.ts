import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\d{8}$/, {
    message:
      'O número de telefone deve conter apenas o DDD e o número (ex: 1199999999)',
  })
  @Transform(({ value }) => (value ? `+55${value}` : value)) // Adiciona o código do país (+55) automaticamente
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'O endereço não pode ter mais de 255 caracteres.',
  })
  @Matches(/^[A-Za-z0-9\s,.-áãçéíóúàèù]+$/, {
    message:
      'O endereço deve seguir o formato: "Rua XYZ, 123, Bairro ABC, Cidade DEF, Estado GH, 12345-678"',
  })
  @Transform(({ value }) => (value ? value.trim() : value))
  address?: string;
}
