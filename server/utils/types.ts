import type { z } from "zod";
import type {
  checkReturningVisitorRequestSchema,
  registrationRequestSchema,
} from "./validation";

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;
export type CheckReturningVisitorRequest = z.infer<
  typeof checkReturningVisitorRequestSchema
>;

// Keep a minimal DB-related type for username sequence to match the schema
export type UsernameSequence = {
  category: "P" | "J" | "S";
  currentNumber: number;
  updatedAt: number;
};
