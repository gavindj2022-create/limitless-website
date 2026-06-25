import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // The real connection string is supplied via the DATABASE_URL env var at
    // migrate/runtime. Fall back to a placeholder so `prisma generate` can run
    // without a database (e.g. during `npm install` / CI builds) — generate
    // does not open a connection.
    url: process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/db",
  },
});
