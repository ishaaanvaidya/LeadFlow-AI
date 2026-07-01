import "server-only"
import { db } from "@/lib/db"
import { CreateTaskInput, UpdateTaskInput } from "../schemas/tasks.schema"

export async function getTasks(userId: string) {
  return db.task.findMany({
    where: { userId, archivedAt: null },
    include: {
      lead: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: [{ isCompleted: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  })
}

export async function getTaskById(userId: string, id: string) {
  return db.task.findFirst({
    where: { id, userId, archivedAt: null },
    include: {
      lead: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const { title, description, dueDate, leadId, contactId } = input
  return db.task.create({
    data: {
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      leadId: leadId || null,
      contactId: contactId || null,
      userId,
    },
  })
}

export async function updateTask(userId: string, id: string, input: UpdateTaskInput) {
  const { title, description, dueDate, leadId, contactId, isCompleted } = input

  const existing = await db.task.findFirst({ where: { id, userId, archivedAt: null } })
  if (!existing) throw new Error("Task not found or unauthorized")

  return db.task.update({
    where: { id },
    data: {
      title: title !== undefined ? title : undefined,
      description: description !== undefined ? (description || null) : undefined,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
      leadId: leadId !== undefined ? (leadId || null) : undefined,
      contactId: contactId !== undefined ? (contactId || null) : undefined,
      isCompleted: isCompleted !== undefined ? isCompleted : undefined,
    },
  })
}

export async function deleteTask(userId: string, id: string) {
  const existing = await db.task.findFirst({ where: { id, userId, archivedAt: null } })
  if (!existing) throw new Error("Task not found or unauthorized")

  return db.task.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}

export async function completeTask(userId: string, id: string) {
  const existing = await db.task.findFirst({ where: { id, userId, archivedAt: null } })
  if (!existing) throw new Error("Task not found or unauthorized")

  return db.task.update({
    where: { id },
    data: { isCompleted: true },
  })
}
