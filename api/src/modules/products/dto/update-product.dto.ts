import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  name?: string;

  @IsString()
  @MinLength(10, {
    message: 'A descrição deve ter no mínimo 10 caracteres.',
  })
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres.',
  })
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'A URL da imagem não é válida.' })
  @MaxLength(255, {
    message: 'A URL da imagem não pode ter mais de 255 caracteres.',
  })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: 'A hash da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'A hash da imagem não é válida.' })
  @MaxLength(255, {
    message: 'A hash da imagem não pode ter mais de 255 caracteres.',
  })
  imageDeleteHash?: string;

  @IsOptional()
  @IsBoolean({ message: 'O valor de isAvailable deve ser um booleano.' })
  isAvailable?: boolean;
}
