"use client"

import * as React from "react"
import Link from "next/link"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { generateLeadScoreAction, generateEmailDraftAction } from "../actions/leads.actions"
import { createNoteAction, deleteNoteAction } from "../../notes/actions/notes.actions"
import { toast } from "sonner"
import {
  ChevronLeft,
  Mail,
  Phone,
  DollarSign,
  Building,
  User,
  Calendar,
  Sparkles,
  Loader2,
  Plus,
  Trash,
  Clock,
} from "lucide-react"

interface NoteItem {
  id: string
  content: string
  createdAt: string | Date
}

interface TaskItem {
  id: string
  title: string
  isCompleted: boolean
  dueDate: string | Date | null
}

interface MeetingItem {
  id: string
  title: string
  startTime: string | Date
  location: string | null
}

interface ActivityItem {
  id: string
  description: string
  createdAt: string | Date
}

interface LeadScoreItem {
  score: string
  explanation: string
  confidence: number | null
  signals?: {
    positive?: string[]
    negative?: string[]
  }
}

interface EmailDraftItem {
  subject: string | null
  body: string
}

interface LeadDetail {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  estimatedValue: number | null
  score: string
  createdAt: string | Date
  stage: { name: string } | null
  company: { name: string; website: string | null; industry: string | null; description: string | null } | null
  contact: { firstName: string; lastName: string; email: string | null; phone: string | null; jobTitle: string | null } | null
  notes: NoteItem[]
  tasks: TaskItem[]
  meetings: MeetingItem[]
  activities: ActivityItem[]
  leadScores: LeadScoreItem[]
  emailDrafts: EmailDraftItem[]
}

interface LeadDetailClientProps {
  lead: LeadDetail
}

export function LeadDetailClient({ lead }: LeadDetailClientProps) {
  const [noteContent, setNoteContent] = React.useState("")
  const [isScoring, setIsScoring] = React.useState(false)
  const [isDrafting, setIsDrafting] = React.useState(false)
  const [isSavingNote, setIsSavingNote] = React.useState(false)

  const reloadData = React.useCallback(() => {
    window.location.reload()
  }, [])

  const handleScore = async () => {
    setIsScoring(true)
    try {
      const res = await generateLeadScoreAction(lead.id)
      if (res.success) {
        toast.success("AI Lead Score generated successfully!")
        reloadData()
      } else {
        toast.error(res.error || "Failed to score lead")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      toast.error(message)
    } finally {
      setIsScoring(false)
    }
  }

  const handleDraft = async () => {
    setIsDrafting(true)
    try {
      const res = await generateEmailDraftAction(lead.id, "Professional")
      if (res.success) {
        toast.success("AI Email Draft generated successfully!")
        reloadData()
      } else {
        toast.error(res.error || "Failed to draft email")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      toast.error(message)
    } finally {
      setIsDrafting(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    setIsSavingNote(true)
    try {
      const res = await createNoteAction(lead.id, noteContent)
      if (res.success) {
        toast.success("Note added successfully")
        setNoteContent("")
        reloadData()
      } else {
        toast.error(res.error || "Failed to add note")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      toast.error(message)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      const res = await deleteNoteAction(lead.id, noteId)
      if (res.success) {
        toast.success("Note deleted")
        reloadData()
      } else {
        toast.error(res.error || "Failed to delete note")
      }
    }
  }

  const latestScore = lead.leadScores?.[0]
  const latestDraft = lead.emailDrafts?.[0]

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/leads" className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Leads
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{lead.name}</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {lead.name}
              </h1>
              <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {lead.stage?.name || "Unknown"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-500">
              Created on {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleScore} disabled={isScoring} className="flex items-center gap-1.5">
              {isScoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              AI Evaluate Score
            </Button>
            <Button onClick={handleDraft} disabled={isDrafting} className="flex items-center gap-1.5">
              {isDrafting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              AI Outbound Draft
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Columns - Lead/Company/Contact Profile & AI details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Card */}
              <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-neutral-500" /> Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lead.contact ? (
                    <>
                      <div>
                        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                          {lead.contact.firstName} {lead.contact.lastName}
                        </p>
                        <p className="text-xs text-neutral-550">{lead.contact.jobTitle || "No Title"}</p>
                      </div>
                      <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {lead.contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-neutral-400" />
                            <span>{lead.contact.email}</span>
                          </div>
                        )}
                        {lead.contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-neutral-400" />
                            <span>{lead.contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-400">No contact person linked.</p>
                  )}
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-neutral-500" /> Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lead.company ? (
                    <>
                      <div>
                        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                          {lead.company.name}
                        </p>
                        {lead.company.website && (
                          <a
                            href={`https://${lead.company.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {lead.company.website}
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <p className="text-xs text-neutral-400">Industry: {lead.company.industry || "N/A"}</p>
                        <p className="mt-1 text-xs line-clamp-2">{lead.company.description || "No description logged."}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-400">No company linked.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Financial Details */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-neutral-500" /> Financial & Source Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 pt-0">
                <div>
                  <span className="text-xs text-neutral-400 block uppercase font-medium">Est. Value</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    {lead.estimatedValue
                      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(lead.estimatedValue)
                      : "Not Specified"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block uppercase font-medium">Source</span>
                  <span className="text-sm font-semibold capitalize text-neutral-700 dark:text-neutral-300">
                    {lead.source || "OTHER"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block uppercase font-medium">Contact Phone</span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{lead.phone || "-"}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Scoring Summary */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-500" /> Lead Score Assessment
                  </CardTitle>
                  <Badge variant="outline" className="bg-purple-50/50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400">
                    Score: {lead.score}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestScore ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">AI Assessment</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {latestScore.explanation}
                      </p>
                    </div>

                    {latestScore.signals && (
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider block">Positive Signals</span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                            {(latestScore.signals.positive || []).map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider block">Negative Signals</span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                            {(latestScore.signals.negative || []).map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-450 italic">Evaluate this lead to get AI sales scores.</p>
                )}
              </CardContent>
            </Card>

            {/* AI Email Draft Section */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-blue-500" /> Outbound Outreach Draft
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestDraft ? (
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">Subject</span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{latestDraft.subject}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(latestDraft.body)
                          toast.success("Draft copied to clipboard!")
                        }}
                      >
                        Copy Body
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-400 block font-medium">Email Content</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed font-mono">
                        {latestDraft.body}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-450 italic">No email draft generated yet. Click &quot;AI Outbound Draft&quot; to compile one.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tasks, Meetings, Notes & Activities */}
          <div className="space-y-6">
            {/* Notes Widget */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  Relationship Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <Input
                    placeholder="Type a meeting note or followup detail..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    disabled={isSavingNote}
                  />
                  <Button type="submit" disabled={!noteContent.trim() || isSavingNote} size="sm" className="w-full flex items-center justify-center gap-1">
                    {isSavingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                    Save Note
                  </Button>
                </form>

                <Separator />

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {lead.notes?.length > 0 ? (
                    lead.notes.map((note) => (
                      <div key={note.id} className="group flex justify-between gap-3 text-sm p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <div className="space-y-1">
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">{note.content}</p>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-450 italic text-center py-4">No notes logged yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  Follow-up Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.tasks?.length > 0 ? (
                  lead.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                      <div className="space-y-0.5">
                        <p className={`font-medium ${task.isCompleted ? "line-through text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}`}>
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Badge variant={task.isCompleted ? "secondary" : "outline"}>
                        {task.isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-450 italic text-center py-4">No pending tasks.</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  Scheduled Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.meetings?.length > 0 ? (
                  lead.meetings.map((meeting) => (
                    <div key={meeting.id} className="space-y-1 text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">{meeting.title}</p>
                      <div className="text-xs text-neutral-450 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(meeting.startTime).toLocaleString()}
                        </span>
                        {meeting.location && <span>Location: {meeting.location}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-450 italic text-center py-4">No meetings scheduled.</p>
                )}
              </CardContent>
            </Card>

            {/* Activity History Timeline */}
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                {lead.activities?.length > 0 ? (
                  <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-2 space-y-4 pl-4 py-1">
                    {lead.activities.map((act) => (
                      <div key={act.id} className="relative space-y-0.5">
                        {/* Dot indicator */}
                        <div className="absolute -left-[21px] mt-1 h-2 w-2 rounded-full border border-white dark:border-neutral-900 bg-neutral-400 dark:bg-neutral-600" />
                        <p className="text-xs text-neutral-800 dark:text-neutral-300 leading-snug">
                          {act.description}
                        </p>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-450 italic text-center py-4">No activity logged.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
