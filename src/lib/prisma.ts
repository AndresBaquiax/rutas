import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function buildDatabaseUrl(): string {
  const { DATABASE_URL, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  return (
    DATABASE_URL ??
    `postgresql://${encodeURIComponent(DB_USERNAME ?? '')}:${encodeURIComponent(DB_PASSWORD ?? '')}` +
      `@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  );
}

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: buildDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
