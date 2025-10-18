import { createHash } from "crypto";

function toBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

type FingerprintFormat = "hex" | "base64url";

/**
 * Generate an SHA-256 fingerprint from provided attributes.
 * - `format` defaults to `base64url` for compactness
 * - `length` if provided will truncate the result (characters)
 */
export function generateFingerprint(
  attrs: {
    userAgent?: string;
    acceptLanguage?: string;
    accept?: string;
    timezone?: string;
    platform?: string;
    salt?: string;
  },
  format: FingerprintFormat = "base64url",
  length?: number,
) {
  const parts = [
    attrs.userAgent ?? "",
    attrs.acceptLanguage ?? "",
    attrs.accept ?? "",
    attrs.timezone ?? "",
    attrs.platform ?? "",
    attrs.salt ?? "",
  ];
  const input = parts.join("||");
  const digest = createHash("sha256").update(input).digest();

  if (format === "hex") {
    const hex = digest.toString("hex");
    return typeof length === "number" ? hex.slice(0, length) : hex;
  }

  const b64 = toBase64Url(digest);
  return typeof length === "number" ? b64.slice(0, length) : b64;
}

/**
 * Helper to extract fingerprint-relevant headers from a Request-like object.
 * Accepts either a headers Record or a Fetch API Request or a Nitro event-like object.
 * Returns a compact base64url fingerprint (default 32 chars).
 */
export function fingerprintFromHeaders(
  headers: Record<string, string | string[] | undefined> | Headers,
  opts?: { format?: FingerprintFormat; length?: number },
) {
  const h = normalizeHeaders(headers);

  const attrs = {
    userAgent: h["user-agent"],
    acceptLanguage: h["accept-language"],
    accept: h["accept"],
    platform: h["sec-ch-ua-platform"] || h["sec-ch-ua"],
    timezone: h["x-timezone"] || undefined,
    salt: undefined,
  };

  const format = opts?.format ?? "base64url";
  const length = opts?.length ?? 32;
  return generateFingerprint(attrs, format, length);
}

function normalizeHeaders(
  headers: Record<string, string | string[] | undefined> | Headers,
) {
  const out: Record<string, string> = {};
  if (headers instanceof Headers) {
    headers.forEach((v, k) => (out[k.toLowerCase()] = v));
    return out;
  }

  for (const key of Object.keys(headers)) {
    const v = (headers as Record<string, string | string[] | undefined>)[key];
    if (Array.isArray(v)) out[key.toLowerCase()] = v.join(",");
    else if (v == null) out[key.toLowerCase()] = "";
    else out[key.toLowerCase()] = String(v);
  }
  return out;
}
