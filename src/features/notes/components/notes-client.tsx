"use client"

import * as React from "react"
import Link from "next/link"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Trash2 } from "lucide-react"
import { deleteNoteAction } from "../../notes/actions/notes.actions"
import { toast } from "sonner"

interface NoteItem {
  id: string
  content: string
  createdAt: string
  lead: { id: string; name: string } | null
}

interface NotesClientProps {
  initialNotes: NoteItem[]
}

export function NotesClient({ initialNotes }: NotesClientProps) {
  const [notes, setNotes] = React.useState<NoteItem[]>(initialNotes)

  const handleDelete = async (note: NoteItem) => {
    if (!note.lead) return
    if (!confirm("Delete this note?")) return
    const res = await deleteNoteAction(note.lead.id, note.id)
    if (res.success) {
      toast.success("Note deleted")
      setNotes((prev) => prev.filter((n) => n.id !== note.id))
    } else {
      toast.error(res.error || "Failed to delete note")
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Notes"
          description="All relationship notes logged across your leads and accounts."
        />

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No notes yet</p>
            <p className="text-xs text-neutral-400 mt-1">Notes are added from individual lead detail pages.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group flex items-start gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                    {note.lead && (
                      <Link
                        href={`/leads/${note.lead.id}`}
                        className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded hover:underline"
                      >
                        {note.lead.name}
                      </Link>
                    )}
                  </div>
                </div>
                {note.lead && (
                  <button
                    onClick={() => handleDelete(note)}
                    className="h-7 w-7 inline-flex items-center justify-center rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
