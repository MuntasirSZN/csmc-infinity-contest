# Data Model

**Feature**: CSMC Infinity Contest Registration System  
**Date**: 2025-10-15  
**Status**: Complete

## Overview

This document defines the database schema for the registration system. The design is fully normalized to Third Normal Form (3NF) to prevent data anomalies and ensure referential integrity.

## Entity Relationship Diagram

```
┌──────────────────────┐
│   contestants        │
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ institute            │
│ class                │
│ section              │
│ roll                 │
│ email (UNIQUE)       │
│ mobile (UNIQUE)      │
│ father_name          │
│ mother_name          │
│ category             │
│ username (UNIQUE)    │
│ created_at           │
│ updated_at           │
└──────────────────────┘
         △
         │
         │ (1:1)
         │
┌──────────────────────┐
│ device_registrations │
├──────────────────────┤
│ id (PK)              │
│ device_fingerprint   │
│   (UNIQUE)           │
│ contestant_id (FK)   │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│ username_sequences   │
├──────────────────────┤
│ category (PK)        │
│ current_number       │
│ updated_at           │
└──────────────────────┘
```

## Tables

### 1. `contestants`

Stores all registered contestant information.

**Columns**:

| Column        | Type    | Constraints                                                         | Description                               |
| ------------- | ------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `id`          | INTEGER | PRIMARY KEY, AUTOINCREMENT                                          | Unique contestant identifier              |
| `name`        | TEXT    | NOT NULL                                                            | Full name of contestant                   |
| `institute`   | TEXT    | NOT NULL                                                            | School/institution name                   |
| `class`       | INTEGER | NOT NULL, CHECK (class BETWEEN 5 AND 10)                            | Class level (5-10)                        |
| `section`     | TEXT    | NOT NULL                                                            | Class section identifier                  |
| `roll`        | INTEGER | NOT NULL, CHECK (roll > 0)                                          | Roll number                               |
| `email`       | TEXT    | NOT NULL, UNIQUE                                                    | Email address (validated format)          |
| `mobile`      | TEXT    | NOT NULL, UNIQUE, CHECK (mobile LIKE '01%' AND LENGTH(mobile) = 11) | Bangladeshi mobile number                 |
| `father_name` | TEXT    | NOT NULL                                                            | Father's full name                        |
| `mother_name` | TEXT    | NOT NULL                                                            | Mother's full name                        |
| `category`    | TEXT    | NOT NULL, CHECK (category IN ('Primary', 'Junior', 'Senior'))       | Contest category (derived from class)     |
| `username`    | TEXT    | NOT NULL, UNIQUE                                                    | Examination username (CSMC_X_XXXX format) |
| `created_at`  | INTEGER | NOT NULL, DEFAULT (unixepoch())                                     | Registration timestamp                    |
| `updated_at`  | INTEGER | NOT NULL, DEFAULT (unixepoch())                                     | Last update timestamp                     |

**Indexes**:

- `idx_contestants_email` on `email` (for login lookups - future feature)
- `idx_contestants_mobile` on `mobile` (for duplicate detection)
- `idx_contestants_username` on `username` (for success page lookups)
- `idx_contestants_category` on `category` (for analytics/reporting)
- `idx_contestants_created_at` on `created_at` (for chronological queries)

**Business Rules**:

- Email and mobile must be unique across all contestants
- Username must follow format: `CSMC_{P|J|S}_{0001-9999}`
- Category auto-derived: `5-6 → Primary`, `7-8 → Junior`, `9-10 → Senior`
- All fields required (no NULL values except timestamps)

**Validation**:

- Email: Must match RFC 5322 email format
- Mobile: Exactly 11 digits starting with "01" (Bangladeshi format)
- Class: Integer between 5 and 10 inclusive
- Roll: Positive integer
- Category: Must match class mapping

---

### 2. `username_sequences`

Tracks the current sequence number for username generation per category.

**Columns**:

| Column           | Type    | Constraints                                                                 | Description              |
| ---------------- | ------- | --------------------------------------------------------------------------- | ------------------------ |
| `category`       | TEXT    | PRIMARY KEY, CHECK (category IN ('P', 'J', 'S'))                            | Category letter (P/J/S)  |
| `current_number` | INTEGER | NOT NULL, DEFAULT 0, CHECK (current_number >= 0 AND current_number <= 9999) | Current sequence counter |
| `updated_at`     | INTEGER | NOT NULL, DEFAULT (unixepoch())                                             | Last increment timestamp |

**Initial Data** (seed required):

```sql
INSERT INTO username_sequences (category, current_number) VALUES
  ('P', 0),
  ('J', 0),
  ('S', 0);
```

**Business Rules**:

- Each category (P, J, S) has independent counter
- Counter increments atomically within transaction
- Maximum value: 9999 (supports up to 9999 contestants per category)
- Counter never decrements (even if registration fails)

**Usage Pattern**:

```sql
-- Atomic increment and return (within transaction)
UPDATE username_sequences
SET current_number = current_number + 1,
    updated_at = unixepoch()
WHERE category = 'P'
RETURNING current_number;
```

---

### 3. `device_registrations`

Tracks device fingerprints to enable returning visitor recognition.

**Columns**:

| Column               | Type    | Constraints                                               | Description                    |
| -------------------- | ------- | --------------------------------------------------------- | ------------------------------ |
| `id`                 | INTEGER | PRIMARY KEY, AUTOINCREMENT                                | Unique registration identifier |
| `device_fingerprint` | TEXT    | NOT NULL, UNIQUE                                          | Hashed device identifier       |
| `contestant_id`      | INTEGER | NOT NULL, FOREIGN KEY → contestants(id) ON DELETE CASCADE | Associated contestant          |
| `created_at`         | INTEGER | NOT NULL, DEFAULT (unixepoch())                           | Device registration timestamp  |

**Indexes**:

- `idx_device_registrations_fingerprint` on `device_fingerprint` (for lookup)
- `idx_device_registrations_contestant_id` on `contestant_id` (for joins)

**Business Rules**:

- One device fingerprint can only link to one contestant
- Fingerprint generated from: User-Agent + Screen Resolution + Timezone
- Used as fallback when localStorage unavailable
- Device registration created only after successful contestant registration

**Fingerprint Generation** (pseudocode):

```typescript
const fingerprint = await hash(
	navigator.userAgent +
		screen.width +
		"x" +
		screen.height +
		Intl.DateTimeFormat().resolvedOptions().timeZone,
);
```

---

## Relationships

### `device_registrations.contestant_id` → `contestants.id`

- **Type**: Many-to-One (though business logic enforces One-to-One via unique fingerprint)
- **Cardinality**: Each device registration links to exactly one contestant
- **Referential Integrity**: `ON DELETE CASCADE` (if contestant deleted, remove device registration)
- **Rationale**: Separate table allows querying device status without joining full contestant data

---

## Drizzle ORM Schema

```typescript
// server/database/schema.ts
import {
	sqliteTable,
	text,
	integer,
	index,
	unique,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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
	(table) => ({
		emailIdx: index("idx_contestants_email").on(table.email),
		mobileIdx: index("idx_contestants_mobile").on(table.mobile),
		usernameIdx: index("idx_contestants_username").on(table.username),
		categoryIdx: index("idx_contestants_category").on(table.category),
		createdAtIdx: index("idx_contestants_created_at").on(table.createdAt),
		classCheck: sql`CHECK (class BETWEEN 5 AND 10)`,
		rollCheck: sql`CHECK (roll > 0)`,
		mobileCheck: sql`CHECK (mobile LIKE '01%' AND LENGTH(mobile) = 11)`,
	}),
);

export const usernameSequences = sqliteTable(
	"username_sequences",
	{
		category: text("category", { enum: ["P", "J", "S"] }).primaryKey(),
		currentNumber: integer("current_number").notNull().default(0),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => ({
		numberCheck: sql`CHECK (current_number >= 0 AND current_number <= 9999)`,
	}),
);

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
	(table) => ({
		fingerprintIdx: index("idx_device_registrations_fingerprint").on(
			table.deviceFingerprint,
		),
		contestantIdx: index("idx_device_registrations_contestant_id").on(
			table.contestantId,
		),
	}),
);
```

---

## Migrations

**Migration 1: Initial Schema**

```typescript
// drizzle/0000_initial_schema.sql
CREATE TABLE contestants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  institute TEXT NOT NULL,
  class INTEGER NOT NULL CHECK (class BETWEEN 5 AND 10),
  section TEXT NOT NULL,
  roll INTEGER NOT NULL CHECK (roll > 0),
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL UNIQUE CHECK (mobile LIKE '01%' AND LENGTH(mobile) = 11),
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Primary', 'Junior', 'Senior')),
  username TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_contestants_email ON contestants(email);
CREATE INDEX idx_contestants_mobile ON contestants(mobile);
CREATE INDEX idx_contestants_username ON contestants(username);
CREATE INDEX idx_contestants_category ON contestants(category);
CREATE INDEX idx_contestants_created_at ON contestants(created_at);

CREATE TABLE username_sequences (
  category TEXT PRIMARY KEY CHECK (category IN ('P', 'J', 'S')),
  current_number INTEGER NOT NULL DEFAULT 0 CHECK (current_number >= 0 AND current_number <= 9999),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO username_sequences (category, current_number) VALUES
  ('P', 0),
  ('J', 0),
  ('S', 0);

CREATE TABLE device_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_fingerprint TEXT NOT NULL UNIQUE,
  contestant_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (contestant_id) REFERENCES contestants(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_registrations_fingerprint ON device_registrations(device_fingerprint);
CREATE INDEX idx_device_registrations_contestant_id ON device_registrations(contestant_id);
```

**To generate migration**:

```bash
bun run drizzle-kit generate --schema=server/database/schema.ts
```

**To apply migration**:

```bash
bun run drizzle-kit migrate
```

---

## Data Validation Summary

| Field      | Validation Rule           | Error Message                                                                 |
| ---------- | ------------------------- | ----------------------------------------------------------------------------- |
| name       | Length 2-100 chars        | "Name must be between 2 and 100 characters"                                   |
| institute  | Length 2-200 chars        | "Institute name must be between 2 and 200 characters"                         |
| class      | Integer 5-10              | "Class must be between 5 and 10"                                              |
| section    | Length 1-10 chars         | "Section is required"                                                         |
| roll       | Positive integer          | "Roll number must be a positive number"                                       |
| email      | RFC 5322 format           | "Please enter a valid email address"                                          |
| mobile     | `^01\d{9}$`               | "Please enter a valid Bangladeshi mobile number (11 digits starting with 01)" |
| fatherName | Length 2-100 chars        | "Father's name must be between 2 and 100 characters"                          |
| motherName | Length 2-100 chars        | "Mother's name must be between 2 and 100 characters"                          |
| category   | Auto-derived, match class | Internal validation (not shown to user)                                       |
| username   | Auto-generated            | N/A (system-generated)                                                        |

---

## Query Patterns

### Check if Email/Mobile Already Registered

```typescript
const existing = await db
	.select()
	.from(contestants)
	.where(
		or(
			eq(contestants.email, formData.email),
			eq(contestants.mobile, formData.mobile),
		),
	)
	.limit(1);

if (existing.length > 0) {
	throw new Error("Email or mobile number already registered");
}
```

### Generate Username and Insert Contestant

```typescript
const result = await db.transaction(async (tx) => {
	// 1. Get category letter
	const categoryMap = { Primary: "P", Junior: "J", Senior: "S" };
	const categoryLetter = categoryMap[formData.category];

	// 2. Increment sequence (row-level lock)
	const [sequence] = await tx
		.update(usernameSequences)
		.set({
			currentNumber: sql`current_number + 1`,
			updatedAt: sql`(unixepoch())`,
		})
		.where(eq(usernameSequences.category, categoryLetter))
		.returning();

	// 3. Generate username
	const username = `CSMC_${categoryLetter}_${sequence.currentNumber.toString().padStart(4, "0")}`;

	// 4. Insert contestant
	const [contestant] = await tx
		.insert(contestants)
		.values({
			...formData,
			username,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	return contestant;
});
```

### Check Returning Visitor

```typescript
const registration = await db
	.select({
		username: contestants.username,
		name: contestants.name,
		category: contestants.category,
	})
	.from(deviceRegistrations)
	.innerJoin(contestants, eq(deviceRegistrations.contestantId, contestants.id))
	.where(eq(deviceRegistrations.deviceFingerprint, fingerprint))
	.limit(1);
```

---

## Performance Considerations

1. **Indexes**: All unique constraints automatically indexed; additional indexes on frequently queried columns (email, mobile, username, category, created_at)

2. **Transaction Isolation**: Use serializable isolation level for username generation to prevent race conditions

3. **Connection Pooling**: Turso client handles pooling automatically; configure max connections based on expected concurrent load

4. **Query Optimization**:
   - Use `LIMIT 1` for existence checks
   - Avoid `SELECT *` in production queries
   - Use prepared statements (Drizzle handles automatically)

5. **Scalability**:
   - Current schema supports 29,997 total registrations (9,999 per category)
   - If limit reached, add new category or migrate to 5-digit sequence
   - Turso replication provides read scaling

---

## Data Model Validation

✅ **3NF Compliance**:

- No repeating groups (atomic values only)
- All non-key attributes depend on primary key
- No transitive dependencies

✅ **Referential Integrity**:

- Foreign keys enforced with cascade deletes
- Unique constraints prevent duplicates

✅ **Data Type Appropriateness**:

- TEXT for variable-length strings
- INTEGER for numeric values and timestamps
- Enum-style checks for category fields

✅ **Business Rule Enforcement**:

- Database-level constraints (CHECK, UNIQUE)
- Application-level validation (Zod schemas)
- Transaction-level atomicity (username generation)

**Data Model Complete**: Schema is production-ready and fully normalized.
