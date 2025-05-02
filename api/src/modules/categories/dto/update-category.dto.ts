import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  name?: string;

  @IsString()
  @MaxLength(100, {
    message: 'O nome do ícone deve ter no máximo 100 caracteres.',
  })
  @IsOptional()
  icon?: string;
}
