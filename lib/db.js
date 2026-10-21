import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let ref1 = globalThis;

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

export const db = ref1.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  ref1.prisma = db;
}