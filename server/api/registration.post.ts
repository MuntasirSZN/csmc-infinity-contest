import { db } from "@@/server/database/client";
import { contestants, deviceRegistrations } from "@@/server/database/schema";
import { consola } from "consola";
import { eq } from "drizzle-orm";
import type { H3Event } from "h3";

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
    existingUsername?: string | null;
  };
};

function errorResponse(
  event: H3Event,
  status: number,
  message: string,
  code: string,
  extras?: Record<string, unknown>,
): ErrorResponse {
  setResponseStatus(event, status);
  return {
    success: false,
    error: { message, code, ...extras },
  };
}

async function checkDuplicate(field: "email" | "mobile", value: string) {
  const column = field === "email" ? contestants.email : contestants.mobile;
  const existing = await db
    .select()
    .from(contestants)
    .where(eq(column, value))
    .limit(1);

  if (existing.length > 0) {
    return {
      isDuplicate: true,
      username: existing[0]?.username ?? null,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`,
      code: `DUPLICATE_${field.toUpperCase()}`,
    };
  }
  return {
    isDuplicate: false,
    username: null,
    message: "",
    code: "",
  };
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const parse = registrationRequestSchema.safeParse(body);
    if (!parse.success) {
      const details = parse.error.issues.map((issue) => ({
        field: issue.path.join("."),
        issue: issue.message,
      }));

      return errorResponse(
        event,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        { details },
      );
    }

    const data = parse.data as RegistrationRequest;

    const emailCheck = await checkDuplicate("email", data.email);
    if (emailCheck.isDuplicate) {
      return errorResponse(event, 409, emailCheck.message, emailCheck.code, {
        existingUsername: emailCheck.username,
      });
    }

    const mobileCheck = await checkDuplicate("mobile", data.mobile);
    if (mobileCheck.isDuplicate) {
      return errorResponse(event, 409, mobileCheck.message, mobileCheck.code, {
        existingUsername: mobileCheck.username,
      });
    }

    const category = deriveCategory(data.grade);

    let username: string | null = null;
    try {
      username = await generateUsername(category);
    } catch (err) {
      consola.error("Username generation failed", err);
      return errorResponse(
        event,
        500,
        "Username generation failed",
        "USERNAME_GENERATION_FAILED",
      );
    }

    try {
      const result = await db.transaction(async (tx) => {
        const insert = await tx
          .insert(contestants)
          .values({
            name: data.fullName,
            institute: data.schoolName,
            class: data.grade,
            section: data.section,
            roll: data.roll,
            email: data.email,
            mobile: data.mobile,
            fatherName: data.fatherName,
            motherName: data.motherName,
            category,
            username,
          })
          .returning({ id: contestants.id, createdAt: contestants.createdAt });

        const contestantRow = insert[0];
        if (!contestantRow) {
          throw new Error("Failed to insert contestant");
        }

        await tx
          .insert(deviceRegistrations)
          .values({
            deviceFingerprint: data.deviceFingerprint,
            contestantId: contestantRow.id,
          })
          .run();

        return contestantRow;
      });

      if (!result) {
        throw new Error("Transaction failed");
      }

      const registeredAt = new Date(
        Number(result.createdAt) * 1000,
      ).toISOString();

      setResponseStatus(event, 201);
      return {
        success: true,
        data: {
          username,
          category,
          fullName: data.fullName,
          mobile: data.mobile,
          email: data.email,
          grade: data.grade,
          schoolName: data.schoolName,
          registeredAt,
        },
      };
    } catch (err) {
      consola.error("Database insert failed", err);
      return errorResponse(event, 500, "Database error", "DATABASE_ERROR");
    }
  } catch (err) {
    consola.error("Unexpected error in registration handler", err);
    return errorResponse(event, 500, "Unknown error", "UNKNOWN_ERROR");
  }
});
