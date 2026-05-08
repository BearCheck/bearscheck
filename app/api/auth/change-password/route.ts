import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { changePasswordSchema } from "@/lib/validations";
import { logSecurityEvent } from "@/lib/security-logs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
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

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.password) {
    return NextResponse.json({ error: "Compte sans mot de passe" }, { status: 400 });
  }

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    await logSecurityEvent("LOGIN_FAILED", { userId: user.id, ip });
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  await logSecurityEvent("PASSWORD_CHANGED", { userId: user.id, ip });

  return NextResponse.json({ success: true });
}
