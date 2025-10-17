import { createClient } from "@libsql/client";
import { consola } from "consola";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./schema";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

export type DBSchema = typeof schema;

function createDatabaseClient() {
  if (TURSO_DATABASE_URL) {
    consola.info("Using Turso libSQL database client");
    return createClient({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN,
    });
  }

  consola.info("Using local libSQL database");
  return createClient({
    url: "file:./data/dev.db",
  });
}

export const db = drizzle(createDatabaseClient(), { schema });
