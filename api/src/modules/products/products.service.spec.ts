import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from '@shared/database/repositories/products.repositories';
import { FileService } from '@shared/utils/file.service';
import { ImageService } from '@shared/utils/image.service';
import { ImgurService } from '@shared/utils/imgur.service';
import { SharpService } from '@shared/utils/sharp.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductsRepo = {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockImgurService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
    extractImageIdFromUrl: jest.fn(),
  };

  const mockSharpService = {
    optimize: jest.fn(),
  };

  const mockFileService = {
    deleteFileIfExists: jest.fn(),
  };

  const mockImageService = {
    readImageFile: jest.fn(),
    validateImageType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepo },
        { provide: ImgurService, useValue: mockImgurService },
        { provide: SharpService, useValue: mockSharpService },
        { provide: FileService, useValue: mockFileService },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a product successfully without image', async () => {
      const dto = {
        companyId: 'company-1',
        categoryId: 'cat-1',
        name: 'Produto Teste',
        description: 'Delícia',
        price: '10.5',
      };

      mockProductsRepo.findFirst.mockResolvedValue(null);
      mockProductsRepo.create.mockResolvedValue({ id: 'prod-1', ...dto });

      const result = await service.create(dto as any);
      expect(mockProductsRepo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'prod-1');
    });

    it('should throw conflict if product name already exists', async () => {
      mockProductsRepo.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.create({
          companyId: 'company-1',
          categoryId: 'cat-1',
          name: 'Produto Existente',
          description: '',
          price: 10,
        } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return product if found', async () => {
      mockProductsRepo.findUnique.mockResolvedValue({ id: '1', name: 'Prod' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockProductsRepo.findUnique.mockResolvedValue(null);
      await expect(service.findOne('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove product and delete image if needed', async () => {
      const product = {
        id: '1',
        imageDeleteHash: 'hash123',
        imageId: 'img123',
      };

      mockProductsRepo.findUnique.mockResolvedValue(product);
      mockProductsRepo.remove.mockResolvedValue(product);

      const result = await service.remove('1');

      expect(mockImgurService.deleteImage).toHaveBeenCalledWith('hash123');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsRepo.findUnique.mockResolvedValue(null);
      await expect(service.remove('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
