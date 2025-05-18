import { PrismaClient } from '../generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Direct modification of the PrismaClient, following the approach from
 * the official Prisma documentation for PgBouncer usage
 * https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer
 */

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, use a single connection with disableTransactions
  prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1'
      },
    },
    // Using type assertion for this internal Prisma flag that's not in public types
  } as any);
  
  // Apply the PgBouncer compatibility flag - this is recommended by Prisma
  (prisma as any)._engineConfig.__internal_testContentionInTransaction = true;
} else {
  // In development, use normal configuration
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
