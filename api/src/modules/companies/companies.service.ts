import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import { Company } from '@prisma/client';
import { CompaniesRepository } from '@shared/database/repositories/companies.repositories';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepo: CompaniesRepository) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name, email, phone, address } = createCompanyDto;

    const emailTaken = await this.companiesRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('Este email já está sendo usado.');
    }

    let slug = slugify(name, {
      lower: true,
      strict: true,
    });

    let slugTaken = await this.companiesRepo.findUnique({
      where: { slug },
      select: { id: true },
    });

    // Caso o slug já exista, adicione um número incremental para garantir unicidade
    let counter = 1;
    while (slugTaken) {
      const newSlug = `${slug}-${counter}`;
      slugTaken = await this.companiesRepo.findUnique({
        where: { slug: newSlug },
        select: { id: true },
      });
      if (!slugTaken) {
        slug = newSlug;
      }
      counter++;
    }

    const company = await this.companiesRepo.create({
      data: {
        name,
        slug,
        email,
        phone,
        address,
      },
    });

    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepo.findAll({});
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepo.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    if (updateCompanyDto.name) {
      updateCompanyDto.slug = slugify(updateCompanyDto.name, {
        lower: true,
        strict: true,
      });
    }

    const company = await this.companiesRepo.update({
      where: { id },
      data: updateCompanyDto,
    });

    if (!company) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return company;
  }

  remove(id: string) {
    return `This action removes a #${id} company`;
  }
}
