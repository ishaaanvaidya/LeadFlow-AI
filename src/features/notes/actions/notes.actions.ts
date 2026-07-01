"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as notesData from "../data/notes.data"
import { createNoteSchema, deleteNoteSchema } from "../schemas/notes.schema"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function createNoteAction(leadId: string, content: string) {
  try {
    const user = await requireUser()
    const parsed = createNoteSchema.parse({ leadId, content })
    const data = await notesData.createNote(user.id, parsed.leadId, parsed.content)
    revalidatePath(`/leads/${leadId}`)
    revalidatePath("/notes")
    revalidatePath("/activities")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create note"
    return { success: false, error: message }
  }
}

export async function deleteNoteAction(leadId: string, noteId: string) {
  try {
    const user = await requireUser()
    const parsed = deleteNoteSchema.parse({ leadId, noteId })
    const data = await notesData.deleteNote(user.id, parsed.leadId, parsed.noteId)
    revalidatePath(`/leads/${leadId}`)
    revalidatePath("/notes")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete note"
    return { success: false, error: message }
  }
}
