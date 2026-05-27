// Prisma client singleton
// Run `npx prisma generate` after setting DATABASE_URL to get full type safety

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */

const globalForPrisma = globalThis as unknown as {
  _prisma: any | undefined;
};

function createClient() {
  try {
    const { PrismaClient } = require("@prisma/client");
    return new PrismaClient();
  } catch {
    // Prisma client not generated yet — return a proxy that warns on use
    return new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "then") return undefined; // prevent promise detection
          console.warn(
            `Prisma client not generated. Run \`npx prisma generate\` first. Tried to access: ${String(prop)}`
          );
          return () =>
            Promise.reject(
              new Error("Prisma client not generated. Run `npx prisma generate`.")
            );
        },
      }
    );
  }
}

export const prisma = globalForPrisma._prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma._prisma = prisma;
}
