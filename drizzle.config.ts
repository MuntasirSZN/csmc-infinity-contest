import { defineConfig } from "drizzle-kit";

const isDev = process.env.NODE_ENV !== "production";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dialect: "turso",
  dbCredentials: isDev
    ? {
        url: "file:./.data/dev.db",
      }
    : {
        url: process.env.DATABASE_URL!,
        authToken: process.env.AUTH_TOKEN!,
      },
});
