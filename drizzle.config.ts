import { defineConfig } from "drizzle-kit";

const isTurso = !!process.env.TURSO_DATABASE_URL;

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dialect: "turso",
  dbCredentials: isTurso
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:./.data/dev.db",
      },
});
