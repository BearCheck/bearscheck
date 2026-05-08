import { NextRequest, NextResponse } from "next/server";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { changePasswordSchema } from "@/lib/validations";
import { logSecurityEvent } from "@/lib/security-logs";

export async function POST(req: NextRequest) {
  const session = await getProSession();
  if (!session) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.auth, ip);
  if (limited) return limited;

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const company = await prisma.company.findUnique({ where: { email: session.email } });
  if (!company) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  }

  const valid = await verifyPassword(currentPassword, company.password);
  if (!valid) {
    await logSecurityEvent("LOGIN_FAILED", { ip, metadata: { type: "pro" } });
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }

  const hashed = await hashPassword(newPassword);
  await prisma.company.update({ where: { id: company.id }, data: { password: hashed } });
  await logSecurityEvent("PASSWORD_CHANGED", { ip, metadata: { type: "pro", companyId: company.id } });

  return NextResponse.json({ success: true });
}
