import { prisma } from '@/lib/prisma';

export class SidebarRepository {
  async findAll() {
    return await prisma.sidebar.findMany();
  }
}