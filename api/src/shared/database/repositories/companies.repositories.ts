import { Injectable } from '@nestjs/common';
import { Company, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.CompanyCreateArgs): Promise<Company> {
    return this.prismaService.company.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.CompanyFindUniqueArgs): Promise<Company> {
    return this.prismaService.company.findUnique(findUniqueDto);
  }

  // Buscar todas as empresas
  findAll(findManyDto: Prisma.CompanyFindManyArgs): Promise<Company[]> {
    return this.prismaService.company.findMany(findManyDto);
  }

  // Atualizar uma empresa
  update(updateDto: Prisma.CompanyUpdateArgs): Promise<Company> {
    return this.prismaService.company.update(updateDto);
  }

  // Deletar uma empresa
  remove(deleteDto: Prisma.CompanyDeleteArgs): Promise<Company> {
    return this.prismaService.company.delete(deleteDto);
  }

  // Contar todas as empresas
  count(countDto: Prisma.CompanyCountArgs): Promise<number> {
    return this.prismaService.company.count(countDto);
  }
}
