import { NextRequest, NextResponse } from "next/server";
import { recordConversion, recordAffiliateEvent } from "@/lib/tracking";

export async function POST(req: NextRequest) {
  try {
    const { affiliateCode, description } = await req.json();
    if (!affiliateCode) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await Promise.all([
      recordConversion(affiliateCode, description),
      recordAffiliateEvent(affiliateCode, "CONVERSION_INTENT"),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
