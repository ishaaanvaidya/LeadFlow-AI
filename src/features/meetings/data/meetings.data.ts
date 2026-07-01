import "server-only"
import { db } from "@/lib/db"
import { CreateMeetingInput, UpdateMeetingInput } from "../schemas/meetings.schema"

export async function getMeetings(userId: string) {
  return db.meeting.findMany({
    where: { userId, archivedAt: null },
    include: {
      lead: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { startTime: "asc" },
  })
}

export async function getMeetingById(userId: string, id: string) {
  return db.meeting.findFirst({
    where: { id, userId, archivedAt: null },
    include: {
      lead: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function createMeeting(userId: string, input: CreateMeetingInput) {
  const { title, description, startTime, endTime, location, leadId, contactId } = input
  return db.meeting.create({
    data: {
      title,
      description: description || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location: location || null,
      leadId: leadId || null,
      contactId: contactId || null,
      userId,
    },
  })
}

export async function updateMeeting(userId: string, id: string, input: UpdateMeetingInput) {
  const { title, description, startTime, endTime, location, leadId, contactId } = input
  const existing = await db.meeting.findFirst({ where: { id, userId, archivedAt: null } })
  if (!existing) throw new Error("Meeting not found or unauthorized")

  return db.meeting.update({
    where: { id },
    data: {
      title: title !== undefined ? title : undefined,
      description: description !== undefined ? (description || null) : undefined,
      startTime: startTime !== undefined ? new Date(startTime) : undefined,
      endTime: endTime !== undefined ? new Date(endTime) : undefined,
      location: location !== undefined ? (location || null) : undefined,
      leadId: leadId !== undefined ? (leadId || null) : undefined,
      contactId: contactId !== undefined ? (contactId || null) : undefined,
    },
  })
}

export async function deleteMeeting(userId: string, id: string) {
  const existing = await db.meeting.findFirst({ where: { id, userId, archivedAt: null } })
  if (!existing) throw new Error("Meeting not found or unauthorized")

  return db.meeting.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}
