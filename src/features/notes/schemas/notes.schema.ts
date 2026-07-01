import { z } from "zod"

export const createNoteSchema = z.object({
  leadId: z.string().cuid("A valid lead is required"),
  content: z.string().trim().min(1, "Note content is required").max(4000, "Notes must be 4,000 characters or fewer"),
})

export const deleteNoteSchema = z.object({
  leadId: z.string().cuid("A valid lead is required"),
  noteId: z.string().cuid("A valid note is required"),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>
