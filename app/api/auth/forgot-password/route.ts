import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return success to avoid revealing whether an email exists
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

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
