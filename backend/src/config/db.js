import { PrismaClient } from "@prisma/client";

// Single Prisma client instance for the entire app
export const prisma = new PrismaClient();
