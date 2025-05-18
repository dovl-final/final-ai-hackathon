import { PrismaClient } from '../generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Define client options based on environment
const prismaClientOptions: any = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

// Configure datasource with PgBouncer mode for production
prismaClientOptions.datasources = {
  db: {
    url: process.env.DATABASE_URL + (process.env.NODE_ENV === 'production' ? '?pgbouncer=true' : '')
  }
};

// Add PostgreSQL options for connection pooling in production
if (process.env.NODE_ENV === 'production') {
  prismaClientOptions.postgresql = {
    options: {
      prepare: false // Disable prepared statements in pooled environments
    }
  };
}

// Create Prisma client with the options
export const prisma = globalForPrisma.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
