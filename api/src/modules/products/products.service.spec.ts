import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from '@shared/database/repositories/products.repositories';
import { CloudinaryService } from '@shared/utils/cloudinary.service';
import { FileService } from '@shared/utils/file.service';
import { ImageService } from '@shared/utils/image.service';
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

  const mockCloudinaryService = {
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
        { provide: CloudinaryService, useValue: mockCloudinaryService },
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

      expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith('hash123');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsRepo.findUnique.mockResolvedValue(null);
      await expect(service.remove('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update product and process image correctly', async () => {
      const productId = 'some-id';
      const updateDto = {
        name: 'Updated Product',
        imageUrl: 'path/to/new-image.jpg',
      } as any;

      const existingProduct = {
        id: productId,
        name: 'Old Product',
        companyId: 'company-id',
        imageUrl: 'old/url.jpg',
        imageDeleteHash: 'old-delete-hash',
        imageId: 'old-image-id',
      };

      jest
        .spyOn(mockProductsRepo, 'findUnique')
        .mockResolvedValue(existingProduct);
      jest.spyOn(mockProductsRepo, 'findFirst').mockResolvedValue(null);

      // Cast do service para any para acessar método private
      const serviceAny = service as any;
      jest.spyOn(serviceAny, 'processImage').mockResolvedValue({
        url: 'new/url.jpg',
        public_id: 'new-public-id',
      });

      jest
        .spyOn(mockCloudinaryService, 'deleteImage')
        .mockResolvedValue(undefined);
      jest
        .spyOn(mockFileService, 'deleteFileIfExists')
        .mockResolvedValue(undefined);

      const updatedProduct = {
        ...existingProduct,
        ...updateDto,
        imageUrl: 'new/url.jpg',
        imageDeleteHash: 'new-public-id',
        imageId: 'new-public-id',
      };
      jest.spyOn(mockProductsRepo, 'update').mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateDto);

      expect(serviceAny.processImage).toHaveBeenCalledWith(updateDto.imageUrl);
      expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(
        existingProduct.imageDeleteHash,
      );
      expect(mockFileService.deleteFileIfExists).toHaveBeenCalledWith(
        existingProduct.imageUrl,
      );
      expect(result.imageUrl).toBe('new/url.jpg');
      expect(result.imageDeleteHash).toBe('new-public-id');
      expect(result.imageId).toBe('new-public-id');
    });
  });
});
