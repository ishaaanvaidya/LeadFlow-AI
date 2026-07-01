import "server-only"
import { db } from "@/lib/db"
import { ActivityType } from "@/generated/prisma/enums"

export async function getNotesByLead(userId: string, leadId: string) {
  return db.note.findMany({
    where: { userId, leadId, archivedAt: null },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllNotes(userId: string) {
  return db.note.findMany({
    where: { userId, archivedAt: null },
    include: {
      lead: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createNote(userId: string, leadId: string, content: string) {
  return db.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: { id: leadId, userId, archivedAt: null },
      select: { id: true, name: true },
    })

    if (!lead) {
      throw new Error("Lead not found or unauthorized")
    }

    const note = await tx.note.create({
      data: { content, leadId, userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    })

    await tx.activity.create({
      data: {
        type: ActivityType.NOTE_ADDED,
        description: `Note added to "${lead.name}".`,
        leadId,
        userId,
      },
    })

    return {
      ...note,
      createdAt: note.createdAt.toISOString(),
    }
  })
}

export async function deleteNote(userId: string, leadId: string, noteId: string) {
  const existing = await db.note.findFirst({ where: { id: noteId, leadId, userId, archivedAt: null } })
  if (!existing) throw new Error("Note not found or unauthorized")
  await db.note.update({ where: { id: noteId }, data: { archivedAt: new Date() } })
  return { id: noteId }
}
