import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as {
    titre?: string; description?: string; dateDebut?: string; dateFin?: string;
    allDay?: boolean; couleur?: string; categorie?: string; rappel?: number;
  };
  try {
    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(body.titre && { titre: body.titre }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.dateDebut && { dateDebut: new Date(body.dateDebut) }),
        ...(body.dateFin !== undefined && { dateFin: body.dateFin ? new Date(body.dateFin) : null }),
        ...(body.allDay !== undefined && { allDay: body.allDay }),
        ...(body.couleur && { couleur: body.couleur }),
        ...(body.categorie && { categorie: body.categorie as EventCategory }),
        ...(body.rappel !== undefined && { rappel: body.rappel }),
      },
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.calendarEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
  }
}
