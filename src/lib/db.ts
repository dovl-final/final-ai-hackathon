import { PrismaClient } from '../generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For Vercel connection pooling with Supabase, we need to append specific URL parameters
// We modify the DATABASE_URL directly in the environment rather than the Prisma constructor
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // Add parameters for PgBouncer support
  if (!process.env.DATABASE_URL.includes('?pgbouncer=true')) {
    process.env.DATABASE_URL = `${process.env.DATABASE_URL}?pgbouncer=true&connection_limit=1&pool_timeout=20`;
  }
}

// Create Prisma client with environment-specific logging
export const prisma = 
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
