import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";
const TURSO_DATABASE_URL = process.env.DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.AUTH_TOKEN;

export type DBSchema = typeof schema;

export const db = drizzle(
  createClient({
    url: isProduction ? TURSO_DATABASE_URL! : "file:local.db",
    authToken: isProduction ? TURSO_AUTH_TOKEN! : undefined,
  }),
  { schema },
);
