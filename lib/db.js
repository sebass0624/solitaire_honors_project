import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

let ref1 = globalThis;

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export const db = ref1.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  ref1.prisma = db;
}