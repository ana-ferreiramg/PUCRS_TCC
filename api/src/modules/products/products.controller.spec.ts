import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import * as path from 'path';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create product and set imageUrl relative path if file is provided', async () => {
      const dto = { name: 'Product 1', price: 100 } as any;
      const file = { path: '/full/path/to/image.jpg' } as Express.Multer.File;
      const relativePath = path.relative(process.cwd(), file.path);

      mockProductsService.create.mockResolvedValue({
        id: '1',
        ...dto,
        imageUrl: relativePath,
      });

      const result = await controller.create(dto, file);

      expect(mockProductsService.create).toHaveBeenCalledWith({
        ...dto,
        imageUrl: relativePath,
      });
      expect(result.imageUrl).toBe(relativePath);
    });

    it('should create product without imageUrl if no file provided', async () => {
      const dto = { name: 'Product 2', price: 200 } as any;

      mockProductsService.create.mockResolvedValue({ id: '2', ...dto });

      const result = await controller.create(dto, null);

      expect(mockProductsService.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', '2');
    });
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          imageUrl: 'uploads/produto1.jpg',
          imageId: 'img123',
          imageDeleteHash: 'hash123',
          description: 'Saboroso',
          isAvailable: true,
          companyId: 'company-uuid',
          categoryId: 'category-uuid',
        },
      ];

      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(mockProductsService.findAll).toHaveBeenCalled();
      expect(result).toBe(products);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const product: Product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        imageUrl: 'uploads/produto1.jpg',
        imageId: 'img123',
        imageDeleteHash: 'hash123',
        description: 'Saboroso',
        isAvailable: true,
        companyId: 'company-uuid',
        categoryId: 'category-uuid',
      };

      mockProductsService.findOne.mockResolvedValue(product);

      const result = await controller.findOne('1');

      expect(mockProductsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(product);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if updateProductDto is missing', async () => {
      await expect(controller.update('1', null, null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update product and set imageUrl relative path if file provided', async () => {
      const dto = { name: 'Updated Product' } as any;
      const file = {
        path: '/full/path/to/updated-image.jpg',
      } as Express.Multer.File;
      const relativePath = path.relative(process.cwd(), file.path);

      const updatedProduct = { id: '1', ...dto, imageUrl: relativePath };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', dto, file);

      expect(mockProductsService.update).toHaveBeenCalledWith('1', {
        ...dto,
        imageUrl: relativePath,
      });
      expect(result).toBe(updatedProduct);
    });

    it('should update product without changing imageUrl if no file provided', async () => {
      const dto = { name: 'Updated Product' } as any;

      const updatedProduct = { id: '1', ...dto, imageUrl: 'some/path.jpg' };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', dto, null);

      expect(mockProductsService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toBe(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should call remove on the service', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(mockProductsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
