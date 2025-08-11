import {PrismaClient} from '@prisma/client';

// This pattern:
// - Prevents multiple Prisma instances in dev (Next.js hot reload can cause that).
// - Makes it easy to import anywhere:
//   import { prisma } from "@/lib/prisma";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // optional for debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;