import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsRepository } from '@shared/database/repositories/products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {
      companyId,
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isAvailable,
    } = createProductDto;

    // Verificando se o nome do produto já existe para a mesma empresa
    const existingProduct = await this.productsRepo.findFirst({
      where: { name, companyId },
      select: { id: true },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Já existe um produto com esse nome para esta empresa.',
      );
    }

    const newProduct = await this.productsRepo.create({
      data: {
        companyId,
        categoryId,
        name,
        description,
        price,
        imageUrl,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepo.findAll({});
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepo.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    // Se estiver tentando alterar o nome, garantir que não haja duplicidade
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const nameTaken = await this.productsRepo.findFirst({
        where: {
          name: updateProductDto.name,
          companyId: product.companyId,
        },
        select: { id: true },
      });

      if (nameTaken) {
        throw new ConflictException(
          `Já existe outro produto com esse nome para esta empresa.`,
        );
      }
    }

    return this.productsRepo.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productsRepo.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return this.productsRepo.remove({ where: { id } });
  }
}
