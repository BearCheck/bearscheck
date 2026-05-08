import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logs";

export async function DELETE(req: NextRequest) {
  const session = await getProSession();
  if (!session) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.auth, ip);
  if (limited) return limited;

  const { password, confirmation } = await req.json();
  if (confirmation !== "SUPPRIMER") {
    return NextResponse.json({ error: "Confirmation incorrecte" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  const company = await prisma.company.findUnique({ where: { email: session.email } });
  if (!company) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  }

  const valid = await verifyPassword(password, company.password);
  if (!valid) {
    await logSecurityEvent("LOGIN_FAILED", { ip, metadata: { type: "pro" } });
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
  }

  await prisma.company.delete({ where: { id: company.id } });
  await logSecurityEvent("ACCOUNT_DELETED", { ip, metadata: { type: "pro" } });

  const cookieStore = await cookies();
  cookieStore.delete("pro_token");

  return NextResponse.json({ success: true });
}
