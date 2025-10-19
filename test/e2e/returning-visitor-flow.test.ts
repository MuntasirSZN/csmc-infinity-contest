import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";
import type { RegistrationApiResponse } from "../../shared/utils/types";

await setup({
  host: "http://localhost:8787",
});

describe("User Story 2 - Returning Visitor Flow", () => {
  it("should recognize returning visitor by device fingerprint", async () => {
    const fingerprint = `test-fp-returning-${Date.now()}`;

    const registrationData = {
      fullName: "Returning User",
      schoolName: "Test School",
      grade: 9,
      section: "C",
      roll: "789",
      email: `returning.${Date.now()}@test.com`,
      mobile: `01512${String(Date.now()).slice(-6)}`,
      fatherName: "Father Name",
      motherName: "Mother Name",
      deviceFingerprint: fingerprint,
    };

    const registrationResult = await $fetch<RegistrationApiResponse>(
      "/api/registration",
      {
        method: "POST",
        body: registrationData,
      },
    );

    expect(registrationResult.success).toBe(true);
    expect(registrationResult.data?.username).toBeDefined();

    const checkResult = await $fetch<
      | { isReturning: false }
      | {
          isReturning: true;
          registration: {
            username: string;
            fullName: string;
            category: string;
          };
        }
    >("/api/registration/check", {
      method: "POST",
      body: { deviceFingerprint: fingerprint },
    });

    expect(checkResult.isReturning).toBe(true);
    if (checkResult.isReturning) {
      expect(checkResult.registration.username).toBe(
        registrationResult.data?.username,
      );
      expect(checkResult.registration.fullName).toBe("Returning User");
      expect(checkResult.registration.category).toBe("Senior");
    }
  });

  it("should return not found for new device fingerprint", async () => {
    const newFingerprint = `test-fp-new-${Date.now()}`;

    const checkResult = await $fetch<
      | { isReturning: false }
      | {
          isReturning: true;
          registration: {
            username: string;
            fullName: string;
            category: string;
          };
        }
    >("/api/registration/check", {
      method: "POST",
      body: { deviceFingerprint: newFingerprint },
    });

    expect(checkResult.isReturning).toBe(false);
  });

  it("should handle invalid fingerprint gracefully", async () => {
    try {
      await $fetch("/api/registration/check", {
        method: "POST",
        body: { deviceFingerprint: "" },
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });
});
