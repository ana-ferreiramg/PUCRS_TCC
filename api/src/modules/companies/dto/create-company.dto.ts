import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório e não pode estar vazio.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório e não pode estar vazio.' })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\d{9}$/, {
    message:
      'O número de telefone deve conter apenas o DDD e o número (ex: 11987654321)',
  })
  @Transform(({ value }) => value?.replace(/\s+/g, '').trim())
  phone?: string;

  @IsString()
  @MaxLength(255, {
    message: 'O endereço não pode ter mais de 255 caracteres.',
  })
  @Matches(/^[A-Za-z0-9\s,.-áãçéíóúàèù]+(?:\s\d{5}-\d{3})?$/, {
    message:
      'O endereço deve seguir o formato: "Rua XYZ, 123, Bairro ABC, Cidade DEF, Estado GH, 12345-678"',
  })
  @Transform(({ value }) => (value ? value.trim() : value))
  address: string;
}
