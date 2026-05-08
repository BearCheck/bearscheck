import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { profileSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.general, ip);
  if (limited) return limited;

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name: parsed.data.name.trim() },
  });

  return NextResponse.json({ success: true });
}
