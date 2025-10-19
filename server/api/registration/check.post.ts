import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@@/server/database/client";
import { deviceRegistrations, contestants } from "@@/server/database/schema";

const checkRequestSchema = z.object({
  deviceFingerprint: z.string().min(1).max(255),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validation = checkRequestSchema.safeParse(body);
    if (!validation.success) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: {
          message: validation.error.issues[0]?.message ?? "Invalid request",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const { deviceFingerprint } = validation.data;

    const result = await db
      .select({
        username: contestants.username,
        category: contestants.category,
        fullName: contestants.name,
        grade: contestants.class,
        schoolName: contestants.institute,
        registeredAt: contestants.createdAt,
      })
      .from(deviceRegistrations)
      .innerJoin(
        contestants,
        eq(deviceRegistrations.contestantId, contestants.id),
      )
      .where(eq(deviceRegistrations.deviceFingerprint, deviceFingerprint))
      .limit(1);

    if (result.length === 0) {
      return {
        isReturning: false,
      };
    }

    const registration = result[0];
    if (!registration) {
      return {
        isReturning: false,
      };
    }

    return {
      isReturning: true,
      registration: {
        username: registration.username,
        category: registration.category,
        fullName: registration.fullName,
        grade: registration.grade,
        schoolName: registration.schoolName,
        registeredAt: registration.registeredAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("[registration/check] Error:", error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: {
        message: "Failed to check registration status",
        code: "DATABASE_ERROR",
      },
    };
  }
});
