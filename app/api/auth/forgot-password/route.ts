import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  // Rate limiting — 5 tentatives par heure par IP
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.auth, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      // Toujours retourner success pour ne pas révéler l'existence de l'email
      return NextResponse.json({ success: true });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bearscheck.com";
    const resetUrl = `${appUrl}/mot-de-passe-oublie/reset?token=${token}`;

    await sendPasswordResetEmail(user.email, resetUrl, user.name ?? undefined);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
