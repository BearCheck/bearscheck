import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.auth, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
