"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { MeetingDialog } from "./meeting-dialog"
import { deleteMeetingAction } from "../actions/meetings.actions"
import { toast } from "sonner"
import { Plus, Calendar, MapPin, Clock, Trash2, Pencil } from "lucide-react"

interface MeetingItem {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  location: string | null
  lead: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
}

interface MeetingsClientProps {
  initialMeetings: MeetingItem[]
}

export function MeetingsClient({ initialMeetings }: MeetingsClientProps) {
  const searchParams = useSearchParams()
  const [meetings, setMeetings] = React.useState<MeetingItem[]>(initialMeetings)
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editMeeting, setEditMeeting] = React.useState<MeetingItem | null>(null)

  const reloadMeetings = React.useCallback(() => window.location.reload(), [])

  const now = new Date()
  const upcoming = meetings.filter((m) => new Date(m.startTime) > now)
  const past = meetings.filter((m) => new Date(m.startTime) <= now)

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this meeting?")) return
    const res = await deleteMeetingAction(id)
    if (res.success) {
      toast.success("Meeting deleted")
      setMeetings((prev) => prev.filter((m) => m.id !== id))
    } else {
      toast.error(res.error || "Failed to delete meeting")
    }
  }

  const MeetingCard = ({ meeting }: { meeting: MeetingItem }) => (
    <div className="group flex items-start gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-sm transition-shadow">
      {/* Date block */}
      <div className="shrink-0 w-14 flex flex-col items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 text-center">
        <span className="text-[10px] font-semibold uppercase text-neutral-500">
          {new Date(meeting.startTime).toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
          {new Date(meeting.startTime).getDate()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{meeting.title}</p>
        {meeting.description && (
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{meeting.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(meeting.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {" – "}
            {new Date(meeting.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {meeting.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {meeting.location}
            </span>
          )}
          {meeting.lead && (
            <span className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded text-[10px]">
              {meeting.lead.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditMeeting(meeting)}
          className="h-7 w-7 inline-flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => handleDelete(meeting.id)}
          className="h-7 w-7 inline-flex items-center justify-center rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Meetings"
          description="Schedule and track client meetings, demos, and discovery calls."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Schedule Meeting
            </Button>
          }
        />

        {/* Upcoming */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Upcoming ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-neutral-400 italic py-4">No upcoming meetings scheduled.</p>
          ) : (
            upcoming.map((m) => <MeetingCard key={m.id} meeting={m} />)
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Past ({past.length})
            </h2>
            <div className="opacity-70 space-y-2">
              {past.map((m) => <MeetingCard key={m.id} meeting={m} />)}
            </div>
          </div>
        )}

        <MeetingDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadMeetings} />
        {editMeeting && (
          <MeetingDialog
            isOpen={!!editMeeting}
            onClose={() => setEditMeeting(null)}
            meetingId={editMeeting.id}
            initialData={{
              title: editMeeting.title,
              description: editMeeting.description || "",
              startTime: editMeeting.startTime.slice(0, 16),
              endTime: editMeeting.endTime.slice(0, 16),
              location: editMeeting.location || "",
              leadId: editMeeting.lead?.id || "",
              contactId: editMeeting.contact?.id || "",
            }}
            onSuccess={reloadMeetings}
          />
        )}
      </div>
    </PageContainer>
  )
}
