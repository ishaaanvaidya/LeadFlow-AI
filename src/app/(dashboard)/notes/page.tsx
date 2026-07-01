import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAllNotes } from "@/features/notes/data/notes.data"
import { NotesClient } from "@/features/notes/components/notes-client"

export const metadata = {
  title: "Notes | LeadFlow AI",
  description: "All relationship notes across your CRM.",
}

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const rawNotes = await getAllNotes(session.user.id)

  const notes = rawNotes.map((n) => ({
    id: n.id,
    content: n.content,
    createdAt: n.createdAt.toISOString(),
    lead: n.lead ? { id: n.lead.id, name: n.lead.name } : null,
  }))

  return <NotesClient initialNotes={notes} />
}
