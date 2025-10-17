import { z } from "zod";

export const gradeSchema = z.union([
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

const nameSchema = (fieldName: string, min = 2, max = 100) =>
  z
    .string()
    .min(min, `${fieldName} must be between ${min} and ${max} characters`)
    .max(max, `${fieldName} must be between ${min} and ${max} characters`)
    .trim();

export const registrationRequestSchema = z.object({
  fullName: nameSchema("Name"),
  mobile: z
    .string()
    .regex(
      /^01\d{9}$/,
      "Please enter a valid Bangladeshi mobile number (11 digits starting with 01)",
    ),
  email: z
    .email("Please enter a valid email address")
    .transform((s) => s.toLowerCase()),
  grade: gradeSchema,
  schoolName: nameSchema("Institute name", 2, 200),
  section: z
    .string()
    .min(1, "Section is required")
    .max(10, "Section must be short")
    .trim(),
  roll: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") return Number(val);
    return val;
  }, z.number().int().positive()),
  fatherName: nameSchema("Father's name"),
  motherName: nameSchema("Mother's name"),
  deviceFingerprint: z.string().min(1).max(255),
});

export const checkReturningVisitorRequestSchema = z.object({
  deviceFingerprint: z.string().min(1).max(255),
});
