import { db } from "@@/server/database/client";
import { usernameSequences } from "@@/server/database/schema";
import { eq, sql } from "drizzle-orm";
import type { Category } from "./category";
import { formatUsername, getCategoryCode } from "./category";

export async function generateUsername(category: Category): Promise<string> {
  const code = getCategoryCode(category);
  const result = await db.transaction(async (tx) => {
    const updated = await tx
      .update(usernameSequences)
      .set({
        currentNumber: sql`current_number + 1`,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(usernameSequences.category, code))
      .returning({ currentNumber: usernameSequences.currentNumber });

    if (updated.length === 0) {
      const inserted = await tx
        .insert(usernameSequences)
        .values({ category: code, currentNumber: 1 })
        .onConflictDoNothing()
        .returning({ currentNumber: usernameSequences.currentNumber });

      const current = inserted[0]?.currentNumber ?? 1;
      return formatUsername(category, current);
    }

    const currentRow = updated[0];
    if (!currentRow) {
      throw new Error("Failed to update username sequence");
    }
    return formatUsername(category, currentRow.currentNumber as number);
  });

  return result;
}
