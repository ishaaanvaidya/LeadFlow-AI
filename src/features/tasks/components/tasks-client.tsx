"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { TaskDialog } from "./task-dialog"
import { deleteTaskAction, completeTaskAction } from "../actions/tasks.actions"
import { toast } from "sonner"
import { Plus, CheckCircle, Circle, Trash2, Calendar, Pencil } from "lucide-react"

interface TaskItem {
  id: string
  title: string
  description: string | null
  isCompleted: boolean
  dueDate: string | null
  lead: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
}

interface TasksClientProps {
  initialTasks: TaskItem[]
}

export function TasksClient({ initialTasks }: TasksClientProps) {
  const searchParams = useSearchParams()
  const [tasks, setTasks] = React.useState<TaskItem[]>(initialTasks)
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editTask, setEditTask] = React.useState<TaskItem | null>(null)
  const [filter, setFilter] = React.useState<"all" | "pending" | "done">("all")

  const reloadTasks = React.useCallback(() => window.location.reload(), [])

  const filteredTasks = React.useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.isCompleted)
    if (filter === "done") return tasks.filter((t) => t.isCompleted)
    return tasks
  }, [tasks, filter])

  const handleComplete = async (id: string) => {
    const res = await completeTaskAction(id)
    if (res.success) {
      toast.success("Task marked as done!")
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: true } : t)))
    } else {
      toast.error(res.error || "Failed to complete task")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return
    const res = await deleteTaskAction(id)
    if (res.success) {
      toast.success("Task deleted")
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } else {
      toast.error(res.error || "Failed to delete task")
    }
  }

  const pendingCount = tasks.filter((t) => !t.isCompleted).length
  const doneCount = tasks.filter((t) => t.isCompleted).length

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Tasks"
          description="Manage all follow-up actions and sales activities."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Task
            </Button>
          }
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800">
          {(["all", "pending", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
                filter === f
                  ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              ].join(" ")}
            >
              {f === "all" ? `All (${tasks.length})` : f === "pending" ? `Pending (${pendingCount})` : `Done (${doneCount})`}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
              <CheckCircle className="h-8 w-8 text-neutral-300 dark:text-neutral-600 mb-3" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No tasks here</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                {filter === "done" ? "No completed tasks yet." : "Create a follow-up task to stay on track."}
              </p>
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={[
                "group flex items-start gap-4 p-4 rounded-lg border bg-white dark:bg-neutral-900 transition-opacity",
                task.isCompleted ? "opacity-60" : "",
                "border-neutral-200 dark:border-neutral-800",
              ].join(" ")}
            >
              {/* Complete Toggle */}
              <button
                onClick={() => !task.isCompleted && handleComplete(task.id)}
                disabled={task.isCompleted}
                className="mt-0.5 text-neutral-400 hover:text-green-500 dark:hover:text-green-400 transition-colors shrink-0"
              >
                {task.isCompleted
                  ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : <Circle className="h-5 w-5" />
                }
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={["text-sm font-semibold", task.isCompleted ? "line-through text-neutral-400" : "text-neutral-900 dark:text-neutral-100"].join(" ")}>
                  {task.title}
                </p>

                {task.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{task.description}</p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.lead && (
                    <span className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded text-[10px]">
                      Lead: {task.lead.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => setEditTask(task)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <TaskDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadTasks} />
        {editTask && (
          <TaskDialog
            isOpen={!!editTask}
            onClose={() => setEditTask(null)}
            taskId={editTask.id}
            initialData={{
              title: editTask.title,
              description: editTask.description || "",
              dueDate: editTask.dueDate || "",
              leadId: editTask.lead?.id || "",
              contactId: editTask.contact?.id || "",
            }}
            onSuccess={reloadTasks}
          />
        )}
      </div>
    </PageContainer>
  )
}
