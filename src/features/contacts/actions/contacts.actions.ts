"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as contactsData from "../data/contacts.data"
import { createContactSchema, updateContactSchema } from "../schemas/contacts.schema"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getContactsAction() {
  try {
    const user = await requireUser()
    const data = await contactsData.getContacts(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch contacts"
    return { success: false, error: message }
  }
}

export async function getContactByIdAction(id: string) {
  try {
    const user = await requireUser()
    const data = await contactsData.getContactById(user.id, id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch contact"
    return { success: false, error: message }
  }
}

export async function createContactAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createContactSchema.parse(input)
    const data = await contactsData.createContact(user.id, parsed)
    revalidatePath("/contacts")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create contact"
    return { success: false, error: message }
  }
}

export async function updateContactAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateContactSchema.parse({
      ...(input as Record<string, unknown>),
      id,
    })
    const data = await contactsData.updateContact(user.id, id, parsed)
    revalidatePath("/contacts")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update contact"
    return { success: false, error: message }
  }
}

export async function deleteContactAction(id: string) {
  try {
    const user = await requireUser()
    const data = await contactsData.deleteContact(user.id, id)
    revalidatePath("/contacts")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete contact"
    return { success: false, error: message }
  }
}
