import { defineConfig } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dialect: "turso",
  dbCredentials: isProduction
    ? {
        url: process.env.DATABASE_URL!,
        authToken: process.env.AUTH_TOKEN!,
      }
    : {
        url: "file:local.db",
      },
});
