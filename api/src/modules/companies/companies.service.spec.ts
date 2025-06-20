import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Company } from '@prisma/client';
import { CompaniesRepository } from '@shared/database/repositories/companies.repositories';
import { SlugifyService } from '@shared/utils/slugify.service';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepo: Partial<Record<keyof CompaniesRepository, jest.Mock>>;
  let slugifyService: Partial<Record<keyof SlugifyService, jest.Mock>>;

  beforeEach(async () => {
    companiesRepo = {
      findUnique: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    slugifyService = {
      generateSlug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: CompaniesRepository,
          useValue: companiesRepo,
        },
        {
          provide: SlugifyService,
          useValue: slugifyService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  describe('create', () => {
    it('should create a company with unique slug and formatted phone', async () => {
      const dto: CreateCompanyDto = {
        name: 'Test Company',
        email: 'test@email.com',
        phone: '34988776655',
        address: 'Address 123',
      };

      const slug = 'test-company';
      slugifyService.generateSlug.mockReturnValue(slug);

      companiesRepo.findUnique.mockResolvedValue(null); // email não existe
      // Simula slug não existente
      companiesRepo.findUnique.mockResolvedValueOnce(null);
      companiesRepo.create.mockResolvedValue({
        id: '1',
        name: dto.name,
        slug,
        email: dto.email,
        phone: '+55' + dto.phone,
        address: dto.address,
        isActive: true,
      } as Company);

      const result = await service.create(dto);

      expect(slugifyService.generateSlug).toHaveBeenCalledWith(dto.name);
      expect(companiesRepo.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+5534988776655',
        }),
      });
      expect(result).toHaveProperty('id', '1');
      expect(result.phone).toBe('+55' + dto.phone);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto: CreateCompanyDto = {
        name: 'Test Company',
        email: 'test@email.com',
        phone: '34988776655',
        address: 'Address 123',
      };

      companiesRepo.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(companiesRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies: Company[] = [
        {
          id: '1',
          name: 'Comp1',
          slug: 'comp1',
          email: 'c1@test.com',
          phone: '+55123456789',
          address: 'addr',
          isActive: true,
        },
        {
          id: '2',
          name: 'Comp2',
          slug: 'comp2',
          email: 'c2@test.com',
          phone: '+55123456780',
          address: 'addr2',
          isActive: true,
        },
      ];

      companiesRepo.findAll.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(result).toBe(companies);
      expect(companiesRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a company if found', async () => {
      const company: Company = {
        id: '1',
        name: 'Company 1',
        slug: 'company-1',
        email: 'company1@test.com',
        phone: '+55123456789',
        address: 'address',
        isActive: true,
      };

      companiesRepo.findUnique.mockResolvedValue(company);

      const result = await service.findOne('1');

      expect(result).toBe(company);
      expect(companiesRepo.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if company not found', async () => {
      companiesRepo.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return updated company, including slug generation', async () => {
      const id = '1';
      const dto: UpdateCompanyDto = { name: 'New Name' };

      slugifyService.generateSlug.mockReturnValue('new-name');
      // Simula slug único
      companiesRepo.findUnique.mockResolvedValue(null);
      const updatedCompany: Company = {
        id,
        name: dto.name,
        slug: 'new-name',
        email: 'email@test.com',
        phone: '+55123456789',
        address: 'address',
        isActive: true,
      };

      companiesRepo.update.mockResolvedValue(updatedCompany);

      const result = await service.update(id, dto);

      expect(slugifyService.generateSlug).toHaveBeenCalledWith(dto.name);
      expect(companiesRepo.update).toHaveBeenCalledWith({
        where: { id },
        data: { ...dto, slug: 'new-name' },
      });
      expect(result).toBe(updatedCompany);
    });

    it('should throw NotFoundException if update returns null', async () => {
      companiesRepo.findUnique.mockResolvedValue(null);
      companiesRepo.update.mockResolvedValue(null);

      await expect(service.update('1', { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the company', async () => {
      const company: Company = {
        id: '1',
        name: 'Company 1',
        slug: 'company-1',
        email: 'company1@test.com',
        phone: '+55123456789',
        address: 'address',
        isActive: true,
      };

      companiesRepo.remove.mockResolvedValue(company);

      const result = await service.remove('1');

      expect(companiesRepo.remove).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(company);
    });

    it('should throw NotFoundException if company not found for removal', async () => {
      companiesRepo.remove.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('ensureUniqueSlug (private)', () => {
    it('should generate unique slug appending suffix if slug exists', async () => {
      const baseSlug = 'test-company';
      slugifyService.generateSlug.mockReturnValue(baseSlug);

      // Simula slugTaken para baseSlug e para 'test-company-1' (ocupado), mas libera no 'test-company-2'
      companiesRepo.findUnique
        .mockResolvedValueOnce({ id: '1' }) // baseSlug existe
        .mockResolvedValueOnce({ id: '2' }) // test-company-1 existe
        .mockResolvedValueOnce(null); // test-company-2 não existe

      // Usando any para acessar método privado via casting
      const result = await (service as any).ensureUniqueSlug('Test Company');

      expect(result).toBe('test-company-2');
      expect(companiesRepo.findUnique).toHaveBeenCalledTimes(3);
    });
  });

  describe('formatPhoneNumber (private)', () => {
    it('should prepend +55 if phone does not start with +55', () => {
      const phone = '34988776655';
      const formatted = (service as any).formatPhoneNumber(phone);
      expect(formatted).toBe('+5534988776655');
    });

    it('should not modify phone if it starts with +55', () => {
      const phone = '+5534988776655';
      const formatted = (service as any).formatPhoneNumber(phone);
      expect(formatted).toBe(phone);
    });

    it('should return undefined if phone is undefined or null', () => {
      const formatted = (service as any).formatPhoneNumber(undefined);
      expect(formatted).toBeUndefined();
    });
  });
});
