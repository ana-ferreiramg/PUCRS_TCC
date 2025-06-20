import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { CategoriesRepository } from '@shared/database/repositories/categories.repositories';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepo: Partial<Record<keyof CategoriesRepository, jest.Mock>>;

  beforeEach(async () => {
    categoriesRepo = {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: categoriesRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const dto = { name: 'Bebidas', companyId: 'company1', icon: '🍹' };
      const result: Category = {
        id: '1',
        name: 'Bebidas',
        companyId: 'company1',
        icon: '🍹',
      } as Category;

      categoriesRepo.findFirst!.mockResolvedValue(null);
      categoriesRepo.create!.mockResolvedValue(result);

      const response = await service.create(dto);

      expect(categoriesRepo.findFirst).toHaveBeenCalledWith({
        where: { name: dto.name, companyId: dto.companyId },
        select: { id: true },
      });
      expect(categoriesRepo.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(response).toBe(result);
    });

    it('should throw ConflictException if category name already exists for the company', async () => {
      const dto = { name: 'Bebidas', companyId: 'company1', icon: '🍹' };

      categoriesRepo.findFirst!.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(categoriesRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result: Category[] = [
        {
          id: '1',
          name: 'Bebidas',
          companyId: 'company1',
          icon: '🍹',
        } as Category,
        {
          id: '2',
          name: 'Comidas',
          companyId: 'company1',
          icon: '🍔',
        } as Category,
      ];

      categoriesRepo.findAll!.mockResolvedValue(result);

      const response = await service.findAll();

      expect(categoriesRepo.findAll).toHaveBeenCalledWith({});
      expect(response).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const id = '1';
      const result: Category = {
        id,
        name: 'Bebidas',
        companyId: 'company1',
        icon: '🍹',
      } as Category;

      categoriesRepo.findUnique!.mockResolvedValue(result);

      const response = await service.findOne(id);

      expect(categoriesRepo.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(response).toBe(result);
    });

    it('should throw NotFoundException if category not found', async () => {
      const id = 'non-existent';

      categoriesRepo.findUnique!.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const id = '1';
      const updateDto = { name: 'Bebidas Atualizadas', icon: '🍸' };
      const existingCategory: Category = {
        id,
        name: 'Bebidas',
        companyId: 'company1',
        icon: '🍹',
      } as Category;
      const updatedCategory: Category = {
        ...existingCategory,
        ...updateDto,
      };

      categoriesRepo.findUnique!.mockResolvedValue(existingCategory);
      categoriesRepo.findFirst!.mockResolvedValue(null);
      categoriesRepo.update!.mockResolvedValue(updatedCategory);

      const response = await service.update(id, updateDto);

      expect(categoriesRepo.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(categoriesRepo.findFirst).toHaveBeenCalledWith({
        where: {
          name: updateDto.name,
          companyId: existingCategory.companyId,
        },
        select: { id: true },
      });
      expect(categoriesRepo.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(response).toBe(updatedCategory);
    });

    it('should throw NotFoundException if category to update does not exist', async () => {
      const id = 'non-existent';
      const updateDto = { name: 'Qualquer coisa' };

      categoriesRepo.findUnique!.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(categoriesRepo.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if updated name already exists for company', async () => {
      const id = '1';
      const updateDto = { name: 'Nome Existente' };
      const existingCategory: Category = {
        id,
        name: 'Old Name',
        companyId: 'company1',
        icon: '🍹',
      } as Category;

      categoriesRepo.findUnique!.mockResolvedValue(existingCategory);
      categoriesRepo.findFirst!.mockResolvedValue({ id: 'another-id' });

      await expect(service.update(id, updateDto)).rejects.toThrow(
        ConflictException,
      );
      expect(categoriesRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove category successfully', async () => {
      const id = '1';
      const existingCategory: Category = {
        id,
        name: 'Bebidas',
        companyId: 'company1',
        icon: '🍹',
      } as Category;

      categoriesRepo.findUnique!.mockResolvedValue(existingCategory);
      categoriesRepo.remove!.mockResolvedValue(existingCategory);

      const response = await service.remove(id);

      expect(categoriesRepo.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(categoriesRepo.remove).toHaveBeenCalledWith({ where: { id } });
      expect(response).toBe(existingCategory);
    });

    it('should throw NotFoundException if category to remove does not exist', async () => {
      const id = 'non-existent';

      categoriesRepo.findUnique!.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(categoriesRepo.remove).not.toHaveBeenCalled();
    });
  });
});
