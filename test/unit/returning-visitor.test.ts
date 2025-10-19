import { describe, expect, it } from "vitest";
import { checkReturningVisitorRequestSchema } from "../../shared/utils/validation";

describe("User Story 2 - Returning Visitor Recognition", () => {
  it("should validate check returning visitor request with valid fingerprint", () => {
    const validData = {
      deviceFingerprint: "abc123def456789012345678901234567890",
    };

    const result = checkReturningVisitorRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty device fingerprint", () => {
    const invalidData = {
      deviceFingerprint: "",
    };

    const result = checkReturningVisitorRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject missing device fingerprint", () => {
    const invalidData = {};

    const result = checkReturningVisitorRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
