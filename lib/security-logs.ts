import { prisma } from "./prisma";
import crypto from "crypto";

export type SecurityEventType =
  | "LOGIN_FAILED"
  | "LOGIN_SUCCESS"
  | "UNAUTHORIZED_ACCESS"
  | "RATE_LIMIT_HIT"
  | "ACCOUNT_CREATED"
  | "ACCOUNT_DELETED"
  | "PASSWORD_CHANGED"
  | "ADMIN_ACTION";

export async function logSecurityEvent(
  type: SecurityEventType,
  details: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, string | number | boolean | null>;
  } = {}
) {
  try {
    await prisma.securityLog.create({
      data: {
        type,
        userId: details.userId ?? null,
        ip: details.ip ? hashIP(details.ip) : null,
        userAgent: details.userAgent ?? null,
        metadata: details.metadata ?? {},
      },
    });
  } catch {
    // Ne jamais bloquer l'app si le log échoue
    console.warn("[security-log] failed to write event:", type);
  }
}

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.AUTH_SECRET ?? ""))
    .digest("hex")
    .substring(0, 16);
}
