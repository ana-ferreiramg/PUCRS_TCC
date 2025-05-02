import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório e não pode estar vazio.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  name: string;

  @IsString()
  @MinLength(10, {
    message: 'A descrição deve ter no mínimo 10 caracteres.',
  })
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres.',
  })
  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: 'O preço é obrigatório.' })
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price: number;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'A URL da imagem não é válida.' })
  @MaxLength(255, {
    message: 'A URL da imagem não pode ter mais de 255 caracteres.',
  })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'O valor de isAvailable deve ser um booleano.' })
  isAvailable?: boolean;
}
