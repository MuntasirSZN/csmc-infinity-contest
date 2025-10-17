import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/* -------------------------------------------------------------------------- */
/*  CONTESTANTS TABLE                                                         */
/* -------------------------------------------------------------------------- */
export const contestants = sqliteTable(
  "contestants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    institute: text("institute").notNull(),
    class: integer("class").notNull(),
    section: text("section").notNull(),
    roll: integer("roll").notNull(),
    email: text("email").notNull().unique(),
    mobile: text("mobile").notNull().unique(),
    fatherName: text("father_name").notNull(),
    motherName: text("mother_name").notNull(),
    category: text("category", {
      enum: ["Primary", "Junior", "Senior"],
    }).notNull(),
    username: text("username").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_contestants_email").on(table.email),
    index("idx_contestants_mobile").on(table.mobile),
    index("idx_contestants_username").on(table.username),
    index("idx_contestants_category").on(table.category),
    index("idx_contestants_created_at").on(table.createdAt),

    check("ck_contestants_class", sql`class BETWEEN 5 AND 10`),
    check("ck_contestants_roll", sql`roll > 0`),
    check(
      "ck_contestants_mobile",
      sql`mobile LIKE '01%' AND LENGTH(mobile) = 11`,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/*  USERNAME SEQUENCES TABLE                                                  */
/* -------------------------------------------------------------------------- */
export const usernameSequences = sqliteTable(
  "username_sequences",
  {
    category: text("category", { enum: ["P", "J", "S"] }).primaryKey(),
    currentNumber: integer("current_number").notNull().default(0),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  () => [
    check(
      "ck_username_sequences_current_number",
      sql`current_number >= 0 AND current_number <= 9999`,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/*  DEVICE REGISTRATIONS TABLE                                                */
/* -------------------------------------------------------------------------- */
export const deviceRegistrations = sqliteTable(
  "device_registrations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceFingerprint: text("device_fingerprint").notNull().unique(),
    contestantId: integer("contestant_id")
      .notNull()
      .references(() => contestants.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_device_registrations_fingerprint").on(table.deviceFingerprint),
    index("idx_device_registrations_contestant_id").on(table.contestantId),
  ],
);
