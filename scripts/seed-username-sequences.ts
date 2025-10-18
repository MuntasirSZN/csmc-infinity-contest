import { consola } from "consola";
import { db } from "../server/database/client";
import { usernameSequences } from "../server/database/schema";

async function seed() {
  const existing = await db.select().from(usernameSequences).all();
  if (existing.length > 0) {
    consola.log("username_sequences already seeded");
    return;
  }

  const seeds: { category: "P" | "J" | "S"; currentNumber: number }[] = [
    { category: "P", currentNumber: 0 },
    { category: "J", currentNumber: 0 },
    { category: "S", currentNumber: 0 },
  ];

  for (const s of seeds) {
    await db.insert(usernameSequences).values(s).run();
    consola.log("Inserted", s.category);
  }
  consola.log("Seeding complete");
}

seed().catch((err) => {
  consola.error(err);
  process.exit(1);
});
