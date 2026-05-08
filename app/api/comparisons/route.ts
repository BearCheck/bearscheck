import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.comparateur, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { formData, results, affiliateCode } = body;

    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    await prisma.comparison.create({
      data: {
        userId,
        formData,
        results,
        affiliateCode: affiliateCode ?? null,
        completed: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
