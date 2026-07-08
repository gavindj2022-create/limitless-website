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
    // No DATABASE_URL yet (or client not generated) — return a proxy that
    // rejects cleanly on the `prisma.model.method(...)` access pattern instead
    // of throwing a TypeError. Every model access returns a nested proxy whose
    // every method resolves to a promise-returning function that rejects, so
    // callers' try/catch blocks handle the degraded state gracefully.
    const unavailable = () =>
      Promise.reject(
        new Error(
          "Database unavailable — set DATABASE_URL and run `npx prisma db push`."
        )
      );
    const modelProxy = new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === "then") return undefined; // not a thenable
          return unavailable; // create / findMany / update / ... -> rejecting fn
        },
      }
    );
    return new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "then") return undefined; // prevent promise detection
          return modelProxy; // prisma.contactSubmission -> modelProxy
        },
      }
    );
  }
}

export const prisma = globalForPrisma._prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma._prisma = prisma;
}
