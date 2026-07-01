"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createMeetingSchema, CreateMeetingInput } from "../schemas/meetings.schema"
import { createMeetingAction, updateMeetingAction } from "../actions/meetings.actions"
import { getLeadsAction } from "../../leads/actions/leads.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface MeetingDialogProps {
  isOpen: boolean
  onClose: () => void
  meetingId?: string
  initialData?: Partial<CreateMeetingInput>
  onSuccess?: () => void
}

export function MeetingDialog({ isOpen, onClose, meetingId, initialData, onSuccess }: MeetingDialogProps) {
  const [leads, setLeads] = React.useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      getLeadsAction().then((res) => {
        if (res.success && res.data) setLeads(res.data)
      })
    }
  }, [isOpen])

  const form = useForm<CreateMeetingInput>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      location: initialData?.location || "",
      leadId: initialData?.leadId || "",
      contactId: initialData?.contactId || "",
    },
  })

  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        location: initialData.location || "",
        leadId: initialData.leadId || "",
        contactId: initialData.contactId || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateMeetingInput) => {
    setIsSubmitting(true)
    try {
      const result = meetingId
        ? await updateMeetingAction(meetingId, values)
        : await createMeetingAction(values)

      if (result.success) {
        toast.success(meetingId ? "Meeting updated" : "Meeting scheduled")
        form.reset()
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50">
        <DialogHeader>
          <DialogTitle>{meetingId ? "Edit Meeting" : "Schedule Meeting"}</DialogTitle>
          <DialogDescription>
            {meetingId ? "Update meeting details." : "Log a new client meeting or sales call."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Title *</label>
            <Input {...form.register("title")} placeholder="e.g. Discovery call with Acme" error={form.formState.errors.title?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Start Time *</label>
              <Input type="datetime-local" {...form.register("startTime")} error={form.formState.errors.startTime?.message} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">End Time *</label>
              <Input type="datetime-local" {...form.register("endTime")} error={form.formState.errors.endTime?.message} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Location</label>
            <Input {...form.register("location")} placeholder="Zoom / Office / Phone" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Description</label>
            <Input {...form.register("description")} placeholder="Meeting agenda or notes" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Related Lead</label>
            <select
              {...form.register("leadId")}
              className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="">None</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>
              {meetingId ? "Save Changes" : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
