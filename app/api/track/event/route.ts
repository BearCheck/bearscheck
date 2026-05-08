import { NextRequest, NextResponse } from "next/server";
import { recordAffiliateEvent } from "@/lib/tracking";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { affiliateCode, type } = await req.json();
    if (!affiliateCode || !type) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
    const userAgent = req.headers.get("user-agent") ?? undefined;

    await recordAffiliateEvent(affiliateCode, type, ipHash, userAgent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
