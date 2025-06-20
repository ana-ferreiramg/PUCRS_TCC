import { Test, TestingModule } from '@nestjs/testing';
import { Company } from '@prisma/client';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: Partial<Record<keyof CompaniesService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  describe('create', () => {
    it('should create and return a company', async () => {
      const dto = {
        name: 'Test Company',
        email: 'testcompany@email.com',
        address: 'address 123',
      };

      const result: Company = {
        id: '1',
        name: 'Test Company',
        slug: 'test-company',
        email: 'testcompany@email.com',
        phone: '3498877665544',
        address: 'address 123',
        isActive: true,
      };

      service.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result: Company[] = [
        {
          id: '1',
          name: 'Company 1',
          slug: 'company 1',
          email: 'company1@email.com',
          phone: '3498877665544',
          address: 'address 123',
          isActive: true,
        },
        {
          id: '2',
          name: 'Company 2',
          slug: 'company 2',
          email: 'company2@email.com',
          phone: '3498877665544',
          address: 'address 123',
          isActive: true,
        },
      ];

      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single company by id', async () => {
      const id = '2';
      const result: Company = {
        id: '2',
        name: 'Company 2',
        slug: 'company 2',
        email: 'company2@email.com',
        phone: '3498877665544',
        address: 'address 123',
        isActive: true,
      };

      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update and return the updated company', async () => {
      const id = '1';
      const dto = { name: 'Updated Company' };
      const result: Company = {
        id,
        name: 'Updated Company',
        slug: 'company 1',
        email: 'company1@email.com',
        phone: '3498877665544',
        address: 'address 123',
        isActive: true,
      };

      service.update.mockResolvedValue(result);

      expect(await controller.update(id, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call remove and return void', async () => {
      const id = '1';
      service.remove.mockResolvedValue(undefined);

      await expect(controller.remove(id)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
