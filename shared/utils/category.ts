import type { z } from "zod";
import type { Category, CategoryCode } from "./types";
import type { gradeSchema } from "./validation";

export function deriveCategory(
  grade: z.infer<typeof gradeSchema> | undefined,
): Category {
  if (grade === 5 || grade === 6) return "Primary";
  if (grade === 7 || grade === 8) return "Junior";
  if (grade === 9 || grade === 10) return "Senior";
  throw new Error("Invalid grade");
}

export function getCategoryCode(category: Category): CategoryCode {
  if (category === "Primary") return "P";
  if (category === "Junior") return "J";
  return "S";
}

export function formatUsername(category: Category, sequence: number): string {
  return `CSMC_${getCategoryCode(category)}_${sequence.toString().padStart(4, "0")}`;
}
