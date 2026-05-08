import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logs";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export async function POST(req: Request) {
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.auth, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!company || !(await verifyPassword(password, company.password))) {
      await logSecurityEvent("LOGIN_FAILED", { ip, metadata: { type: "pro" } });
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    if (company.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Votre compte a été suspendu. Contactez le support." },
        { status: 403 }
      );
    }

    const token = await new SignJWT({
      sub: company.id,
      email: company.email,
      raisonSociale: company.raisonSociale,
      status: company.status,
      affiliateCode: company.affiliateCode,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    await logSecurityEvent("LOGIN_SUCCESS", { ip, metadata: { type: "pro", companyId: company.id } });

    const res = NextResponse.json({ success: true, status: company.status });
    res.cookies.set("pro_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // renforcé depuis "lax"
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
