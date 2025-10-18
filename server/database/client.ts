import { createClient } from "@libsql/client";
import { consola } from "consola";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./schema";

const TURSO_DATABASE_URL = process.env.DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.AUTH_TOKEN;
const isDev = process.env.NODE_ENV !== "production";

export type DBSchema = typeof schema;

function createDatabaseClient() {
  if (isDev) {
    consola.info("Using local libSQL database");

    return createClient({
      url: "file:./data/dev.db",
    });
  }

  consola.info("Using remote libSQL database");

  return createClient({
    url: TURSO_DATABASE_URL!,
    authToken: TURSO_AUTH_TOKEN!,
  });
}

export const db = drizzle(createDatabaseClient(), { schema });
