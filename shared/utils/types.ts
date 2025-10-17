import type { z } from "zod";
import type {
  apiErrorSchema,
  apiResponseSchema,
  categoryCodeSchema,
  categorySchema,
  checkReturningVisitorRequestSchema,
  gradeSchema,
  registrationApiResponseSchema,
  registrationRequestSchema,
  registrationResponseSchema,
  usernameSequenceSchema,
  validationDetailSchema,
} from "./validation";

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;
export type CheckReturningVisitorRequest = z.infer<
  typeof checkReturningVisitorRequestSchema
>;
export type UsernameSequence = z.infer<typeof usernameSequenceSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryCode = z.infer<typeof categoryCodeSchema>;
export type Grade = z.infer<typeof gradeSchema>;
export type ValidationDetail = z.infer<typeof validationDetailSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = z.infer<
  ReturnType<typeof apiResponseSchema<z.ZodType<T>>>
>;
export type RegistrationResponse = z.infer<typeof registrationResponseSchema>;
export type RegistrationApiResponse = z.infer<
  typeof registrationApiResponseSchema
>;
