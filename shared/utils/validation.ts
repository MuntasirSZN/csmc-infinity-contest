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
