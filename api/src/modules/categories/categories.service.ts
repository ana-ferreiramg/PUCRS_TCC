import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoriesRepository } from '@shared/database/repositories/categories.repositories';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, companyId, icon } = createCategoryDto;

    const nameTaken = await this.categoriesRepo.findFirst({
      where: {
        name,
        companyId,
      },
      select: { id: true },
    });

    if (nameTaken) {
      throw new ConflictException(
        `Já existe uma categoria com esse nome para esta empresa.`,
      );
    }

    return this.categoriesRepo.create({
      data: {
        name,
        companyId,
        icon,
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepo.findAll({});
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepo.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesRepo.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    // Se estiver tentando alterar o nome, garantir que não haja duplicidade
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const nameTaken = await this.categoriesRepo.findFirst({
        where: {
          name: updateCategoryDto.name,
          companyId: category.companyId,
        },
        select: { id: true },
      });

      if (nameTaken) {
        throw new ConflictException(
          `Já existe outra categoria com esse nome para esta empresa.`,
        );
      }
    }

    return this.categoriesRepo.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoriesRepo.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    return this.categoriesRepo.remove({ where: { id } });
  }
}
