import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: Partial<Record<keyof CategoriesService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const dto = { name: 'Bebidas', companyId: 'company1' };
      const result: Category = {
        id: '1',
        name: 'Bebidas',
        icon: '🍹',
        companyId: 'company1',
      };

      service.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [
        {
          id: '1',
          name: 'Bebidas',
          icon: '🍹',
          companyId: 'company1',
        },
        {
          id: '2',
          name: 'Comidas',
          icon: '🍔',
          companyId: 'company2',
        },
      ];

      service.findAll.mockResolvedValue(result);

      const response = await controller.findAll();

      expect(response).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const id = '1';
      const result: Category = {
        id: '1',
        name: 'Bebidas',
        icon: '🍹',
        companyId: 'company1',
      };

      service.findOne.mockResolvedValue(result);

      const response = await controller.findOne(id);

      expect(response).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update and return a category', async () => {
      const id = '1';
      const dto = { name: 'Alimentos' };
      const result: Category = {
        id,
        name: 'Alimentos',
        icon: '🍔',
        companyId: 'company1',
      };

      service.update.mockResolvedValue(result);

      const response = await controller.update(id, dto);

      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a category by ID', async () => {
      const id = '1';

      service.remove.mockResolvedValue(undefined);

      await expect(controller.remove(id)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
