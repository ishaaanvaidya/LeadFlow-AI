import "server-only"
import { db } from "@/lib/db"
import { CreateContactInput, UpdateContactInput } from "../schemas/contacts.schema"

export async function getContacts(userId: string) {
  return db.contact.findMany({
    where: { userId, archivedAt: null },
    include: {
      company: true,
      leads: { where: { archivedAt: null } },
      deals: { where: { archivedAt: null } },
    },
    orderBy: { firstName: "asc" },
  })
}

export async function getContactById(userId: string, id: string) {
  return db.contact.findFirst({
    where: { id, userId, archivedAt: null },
    include: {
      company: true,
      leads: { where: { archivedAt: null } },
      deals: { where: { archivedAt: null } },
    },
  })
}

export async function createContact(userId: string, input: CreateContactInput) {
  const { firstName, lastName, email, phone, jobTitle, companyId } = input
  return db.contact.create({
    data: {
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      jobTitle: jobTitle || null,
      companyId: companyId || null,
      userId,
    },
  })
}

export async function updateContact(userId: string, id: string, input: UpdateContactInput) {
  const { firstName, lastName, email, phone, jobTitle, companyId } = input

  // Verify ownership
  const existing = await db.contact.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Contact not found or unauthorized")
  }

  return db.contact.update({
    where: { id },
    data: {
      firstName: firstName !== undefined ? firstName : undefined,
      lastName: lastName !== undefined ? lastName : undefined,
      email: email !== undefined ? (email || null) : undefined,
      phone: phone !== undefined ? (phone || null) : undefined,
      jobTitle: jobTitle !== undefined ? (jobTitle || null) : undefined,
      companyId: companyId !== undefined ? (companyId || null) : undefined,
    },
  })
}

export async function deleteContact(userId: string, id: string) {
  // Verify ownership
  const existing = await db.contact.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Contact not found or unauthorized")
  }

  return db.contact.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}
