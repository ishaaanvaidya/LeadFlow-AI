"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTaskSchema, CreateTaskInput } from "../schemas/tasks.schema"
import { createTaskAction, updateTaskAction } from "../actions/tasks.actions"
import { getLeadsAction } from "../../leads/actions/leads.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId?: string
  initialData?: Partial<CreateTaskInput>
  onSuccess?: () => void
}

export function TaskDialog({ isOpen, onClose, taskId, initialData, onSuccess }: TaskDialogProps) {
  const [leads, setLeads] = React.useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      getLeadsAction().then((res) => {
        if (res.success && res.data) setLeads(res.data)
      })
    }
  }, [isOpen])

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate || "",
      leadId: initialData?.leadId || "",
      contactId: initialData?.contactId || "",
    },
  })

  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate || "",
        leadId: initialData.leadId || "",
        contactId: initialData.contactId || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateTaskInput) => {
    setIsSubmitting(true)
    try {
      const result = taskId
        ? await updateTaskAction(taskId, values)
        : await createTaskAction(values)

      if (result.success) {
        toast.success(taskId ? "Task updated" : "Task created")
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
      <DialogContent className="sm:max-w-[440px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50">
        <DialogHeader>
          <DialogTitle>{taskId ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {taskId ? "Update task details." : "Log a new follow-up action item."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Title *</label>
            <Input
              {...form.register("title")}
              placeholder="e.g. Follow up with Acme Corp"
              error={form.formState.errors.title?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Description</label>
            <Input
              {...form.register("description")}
              placeholder="Optional notes about this task"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Due Date</label>
            <Input type="date" {...form.register("dueDate")} />
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
              {taskId ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
