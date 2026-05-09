import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const events = await prisma.calendarEvent.findMany({ orderBy: { dateDebut: "asc" } });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await req.json() as {
    titre: string; description?: string; dateDebut: string; dateFin?: string;
    allDay?: boolean; couleur?: string; categorie: string; rappel?: number;
  };
  if (!body.titre || !body.dateDebut || !body.categorie) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }
  const event = await prisma.calendarEvent.create({
    data: {
      titre: body.titre,
      description: body.description,
      dateDebut: new Date(body.dateDebut),
      dateFin: body.dateFin ? new Date(body.dateFin) : undefined,
      allDay: body.allDay ?? false,
      couleur: body.couleur ?? "#C9A84C",
      categorie: body.categorie as EventCategory,
      rappel: body.rappel,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
