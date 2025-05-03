import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '@prisma/client';
import { multerConfig } from '@shared/config/multer.config';
import * as path from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file?.path) {
      const relativePath = path.relative(process.cwd(), file.path);
      createProductDto.imageUrl = relativePath;
    }

    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    if (!updateProductDto) {
      throw new BadRequestException('Dados de atualização não foram enviados.');
    }

    if (file?.path) {
      const relativePath = path.relative(process.cwd(), file.path);
      updateProductDto.imageUrl = relativePath;
    }
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(id);
  }
}
