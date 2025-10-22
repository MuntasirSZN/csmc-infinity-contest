import { z } from "zod";

export const gradeSchema = z.union([
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export const categorySchema = z.union([
  z.literal("Primary"),
  z.literal("Junior"),
  z.literal("Senior"),
]);

const nameSchema = (fieldName: string, min = 2, max = 100) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .min(min, `${fieldName} must be at least ${min} characters long`)
    .max(max, `${fieldName} must not exceed ${max} characters`)
    .trim();

export const registrationRequestSchema = z.object({
  fullName: nameSchema("Name"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^01\d{9}$/,
      "Mobile number must be 11 digits starting with 01 (e.g., 01712345678)",
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email address (e.g., your.email@example.com)")
    .transform((s) => s.toLowerCase()),
  grade: gradeSchema,
  schoolName: nameSchema("Institute name", 2, 200),
  section: z
    .string()
    .min(1, "Section is required")
    .max(10, "Section must be a single character (e.g., A, B, C)")
    .trim(),
  roll: z.coerce
    .number()
    .int("Roll number must be a whole number")
    .positive("Roll number must be greater than 0"),
  fatherName: nameSchema("Father's name"),
  motherName: nameSchema("Mother's name"),
  deviceFingerprint: z.string().min(1).max(255),
});

export const checkReturningVisitorRequestSchema = z.object({
  deviceFingerprint: z.string().min(1).max(255),
});

export const usernameSequenceSchema = z.object({
  category: z.union([z.literal("P"), z.literal("J"), z.literal("S")]),
  currentNumber: z.number().int(),
  updatedAt: z.number(),
});

export const validationDetailSchema = z.object({
  field: z.string(),
  issue: z.string(),
});

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.array(validationDetailSchema).optional(),
  existingUsername: z.string().optional(),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    data: schema.optional(),
    error: apiErrorSchema.optional(),
  });

export const categoryCodeSchema = z.union([
  z.literal("P"),
  z.literal("J"),
  z.literal("S"),
]);

export const registrationResponseSchema = z.object({
  username: z.string(),
  category: categorySchema,
  fullName: z.string(),
  mobile: z.string(),
  email: z.string(),
  grade: gradeSchema,
  schoolName: z.string(),
  registeredAt: z.string(),
});

export const registrationApiResponseSchema = apiResponseSchema(
  registrationResponseSchema,
);
