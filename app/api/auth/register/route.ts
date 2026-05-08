import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validations";
import { logSecurityEvent } from "@/lib/security-logs";

export async function POST(req: Request) {
  // Rate limiting — 3 inscriptions par jour par IP
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.inscription, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name ?? null },
    });

    await logSecurityEvent("ACCOUNT_CREATED", { userId: user.id, ip });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
