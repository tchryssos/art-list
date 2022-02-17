import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';

export declare global {
  var prisma: PrismaClient<PrismaClientOptions>;
}
