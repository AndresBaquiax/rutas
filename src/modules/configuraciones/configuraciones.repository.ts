import { prisma } from '@/lib/prisma';

export class ConfiguracionesRepository {
  async findAll() {
    return await prisma.configuration.findMany();
  }
}
