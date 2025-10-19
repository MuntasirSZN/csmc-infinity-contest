import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";
import { deriveCategory } from "../../shared/utils/category";
import type { Grade, RegistrationApiResponse } from "../../shared/utils/types";

await setup();

describe("User Story 1 - First-Time Registration Journey", () => {
  it("should complete registration flow with valid data and receive username", async () => {
    const testData = {
      fullName: "John Doe",
      schoolName: "Test School",
      grade: 7,
      section: "A",
      roll: "123",
      email: `john.${Date.now()}@test.com`,
      mobile: `0171234${String(Date.now()).slice(-4)}`,
      fatherName: "Father Name",
      motherName: "Mother Name",
      deviceFingerprint: `test-fp-${Date.now()}`,
    };

    const result = await $fetch<RegistrationApiResponse>("/api/registration", {
      method: "POST",
      body: testData,
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.username).toMatch(/^CSMC_J_\d{4}$/);
    expect(result.data?.category).toBe("Junior");
    expect(result.data?.fullName).toBe("John Doe");
  });

  it("should reject duplicate email registration", async () => {
    const testData = {
      fullName: "Jane Doe",
      schoolName: "Test School",
      grade: 8,
      section: "B",
      roll: "456",
      email: `duplicate.${Date.now()}@test.com`,
      mobile: `01798${String(Date.now()).slice(-6)}`,
      fatherName: "Father Name",
      motherName: "Mother Name",
      deviceFingerprint: `test-fp-${Date.now()}-1`,
    };

    await $fetch("/api/registration", {
      method: "POST",
      body: testData,
    });

    try {
      await $fetch("/api/registration", {
        method: "POST",
        body: {
          ...testData,
          deviceFingerprint: `test-fp-${Date.now()}-2`,
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          success: boolean;
          error?: { code: string };
        };
        expect(errorData.success).toBe(false);
        expect(errorData.error?.code).toBe("DUPLICATE_EMAIL");
      }
    }
  });

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
});
