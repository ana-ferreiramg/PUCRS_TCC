import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsRepository } from '@shared/database/repositories/products.repositories';
import { CloudinaryService } from '@shared/utils/cloudinary.service';
import { FileService } from '@shared/utils/file.service';
import { ImageService } from '@shared/utils/image.service';
import { SharpService } from '@shared/utils/sharp.service';
import { unlink, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly sharpService: SharpService,
    private readonly fileService: FileService,
    private readonly imageService: ImageService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Função para processar e enviar a imagem para o Imgur
  private async processImage(
    imagePath?: string,
  ): Promise<{ url: string; public_id: string } | undefined> {
    if (!imagePath) return undefined;

    const fullPath = path.resolve(process.cwd(), imagePath);

    this.imageService.validateImageType(imagePath);

    const originalBuffer = this.imageService.readImageFile(fullPath);

    const optimizedBuffer = await this.sharpService.optimize(originalBuffer);

    const tempFilePath = path.join(os.tmpdir(), `optimized-${Date.now()}.jpg`);

    await writeFile(tempFilePath, optimizedBuffer);

    // Upload usando caminho do arquivo temporário
    const uploaded = await this.cloudinaryService.uploadImage(tempFilePath);

    // Apaga arquivo temporário
    await unlink(tempFilePath);

    // Deleta arquivo original local
    await this.fileService.deleteFileIfExists(fullPath);

    return uploaded;
  }

  private async parsePrice(value: string | number): Promise<number> {
    const parsedValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'O preço informado não é um número válido.',
      );
    }

    if (parsedValue < 0) {
      throw new BadRequestException('O preço não pode ser negativo.');
    }

    return parsedValue;
  }

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

    const parsed = await this.parsePrice(price);

    // Verificando se o nome do produto já existe
    const existingProduct = await this.productsRepo.findFirst({
      where: { name, companyId },
      select: { id: true },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Já existe um produto com esse nome para esta empresa.',
      );
    }

    let finalImageUrl: string | undefined = undefined;
    let deleteHash: string | undefined = undefined;
    let imageId: string | undefined = undefined;

    if (imageUrl) {
      const upload = await this.processImage(imageUrl);
      finalImageUrl = upload?.url;
      deleteHash = upload?.public_id;
      imageId = upload?.public_id;
    }

    const newProduct = await this.productsRepo.create({
      data: {
        companyId,
        categoryId,
        name,
        description,
        price: parsed,
        imageUrl: finalImageUrl,
        imageDeleteHash: deleteHash,
        imageId,
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

  async findPublic(): Promise<Product[]> {
    return this.productsRepo.findAll({
      where: { isAvailable: true },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: true,
        description: true,
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepo.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    console.log('updateProductDto:', updateProductDto);

    // Verifica se o nome foi alterado e garante que não haja duplicidade
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

    let finalImageUrl = product.imageUrl;
    let imageDeleteHash = product.imageDeleteHash;
    let imageId = product.imageId;

    // Verifica se a imagem foi alterada
    if (updateProductDto.imageUrl) {
      // Deleta a imagem anterior do Imgur, se houver
      const oldImageDeleteHash = product.imageDeleteHash;

      if (product.imageId && oldImageDeleteHash) {
        await this.cloudinaryService.deleteImage(oldImageDeleteHash);
      }

      // Se o produto tem imagem local, deleta o arquivo local também
      if (product.imageUrl) {
        await this.fileService.deleteFileIfExists(product.imageUrl);
      }

      // Processa a nova imagem
      const uploadResult = await this.processImage(updateProductDto.imageUrl);
      finalImageUrl = uploadResult?.url;
      imageDeleteHash = uploadResult?.public_id;
      imageId = uploadResult?.public_id;
    }

    // Atualiza os dados no banco de dados
    return this.productsRepo.update({
      where: { id },
      data: {
        ...updateProductDto,
        imageUrl: finalImageUrl,
        imageDeleteHash,
        imageId,
      },
    });
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productsRepo.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    if (product.imageDeleteHash) {
      try {
        await this.cloudinaryService.deleteImage(product.imageDeleteHash);
      } catch (error) {
        console.error('Erro ao excluir imagem do Imgur:', error.message);
      }
    }

    return this.productsRepo.remove({ where: { id } });
  }
}
