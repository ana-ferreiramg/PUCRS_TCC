import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório e não pode estar vazio.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
