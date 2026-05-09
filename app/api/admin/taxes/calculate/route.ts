import { NextResponse } from "next/server";
import { auth } from "@/auth";

const TAUX_COTISATIONS = 0.214;
const ABATTEMENT = 0.50;
const PLAFOND = 77700;

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const ca = parseFloat(searchParams.get("ca") ?? "0");
  const cotisations = ca * TAUX_COTISATIONS;
  const revenuImposable = ca * (1 - ABATTEMENT);
  const revenuNet = ca - cotisations;
  const pourcentagePlafond = (ca / PLAFOND) * 100;
  return NextResponse.json({
    ca, cotisations, revenuImposable, revenuNet,
    pourcentagePlafond: Math.min(pourcentagePlafond, 100),
    plafond: PLAFOND,
    taux: TAUX_COTISATIONS,
    abattement: ABATTEMENT,
  });
}
