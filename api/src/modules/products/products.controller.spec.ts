import { Test, TestingModule } from '@nestjs/testing';
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
});
