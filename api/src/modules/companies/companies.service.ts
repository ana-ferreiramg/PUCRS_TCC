import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Company } from '@prisma/client';
import { CompaniesRepository } from '@shared/database/repositories/companies.repositories';
import { SlugifyService } from '@shared/utils/slugify.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepo: CompaniesRepository,
    private readonly slugifyService: SlugifyService,
  ) {}

  // Função para garantir a unicidade do slug
  private async ensureUniqueSlug(name: string): Promise<string> {
    let slug = this.slugifyService.generateSlug(name);

    let slugTaken = await this.companiesRepo.findUnique({
      where: { slug },
      select: { id: true },
    });

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

    return slug;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name, email, phone, address } = createCompanyDto;

    const emailTaken = await this.companiesRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('Este email já está sendo usado.');
    }

    const slug = await this.ensureUniqueSlug(name);

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
      let slug = this.slugifyService.generateSlug(updateCompanyDto.name);

      slug = await this.ensureUniqueSlug(updateCompanyDto.name);

      updateCompanyDto.slug = slug;
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

  async remove(id: string): Promise<Company> {
    const company = await this.companiesRepo.remove({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }
}
