import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./schema";

const TURSO_DATABASE_URL = process.env.DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.AUTH_TOKEN;

export type DBSchema = typeof schema;

export const db = drizzle(
  createClient({
    url: TURSO_DATABASE_URL!,
    authToken: TURSO_AUTH_TOKEN!,
  }),
  { schema },
);
