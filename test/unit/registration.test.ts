import { describe, expect, it } from "vitest";
import { deriveCategory } from "../../shared/utils/category";
import { registrationRequestSchema } from "../../shared/utils/validation";
import type { Grade } from "../../shared/utils/types";

describe("User Story 1 - Registration Logic", () => {
  it("should derive correct category based on grade", () => {
    const testCases = [
      { grade: 5, expected: "Primary" },
      { grade: 6, expected: "Primary" },
      { grade: 7, expected: "Junior" },
      { grade: 8, expected: "Junior" },
      { grade: 9, expected: "Senior" },
      { grade: 10, expected: "Senior" },
    ];

    testCases.forEach(({ grade, expected }) => {
      const category = deriveCategory(grade as Grade);
      expect(category).toBe(expected);
    });
  });

  it("should validate registration request with valid data", () => {
    const validData = {
      fullName: "John Doe",
      schoolName: "Test School",
      grade: 7,
      section: "A",
      roll: "123",
      email: "john@test.com",
      mobile: "01712345678",
      fatherName: "Father Name",
      motherName: "Mother Name",
      deviceFingerprint: "test-fp",
    };

    const result = registrationRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email format", () => {
    const invalidData = {
      fullName: "John Doe",
      schoolName: "Test School",
      grade: 7,
      section: "A",
      roll: "123",
      email: "invalid-email",
      mobile: "01712345678",
      fatherName: "Father Name",
      motherName: "Mother Name",
      deviceFingerprint: "test-fp",
    };

    const result = registrationRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
