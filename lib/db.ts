import { PrismaClient } from "@prisma/client";

// This file is used to create a singleton instance of PrismaClient
// to avoid creating multiple instances in development mode.
declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
