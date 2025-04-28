import { ConflictException, Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: string) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: string) {
    return `This action removes a #${id} company`;
  }
}
