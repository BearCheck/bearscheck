import { NextRequest, NextResponse } from "next/server";
import { recordConversion, recordAffiliateEvent } from "@/lib/tracking";
import { affiliateCodeSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const { affiliateCode, description } = await req.json();

    // Valider le format du code affilié pour bloquer toute injection
    const parsed = affiliateCodeSchema.safeParse(affiliateCode);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Code affilié invalide" }, { status: 400 });
    }

    await Promise.all([
      recordConversion(parsed.data, description),
      recordAffiliateEvent(parsed.data, "CONVERSION_INTENT"),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
