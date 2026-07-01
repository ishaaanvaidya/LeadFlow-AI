import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getTasks } from "@/features/tasks/data/tasks.data"
import { TasksClient } from "@/features/tasks/components/tasks-client"

export const metadata = {
  title: "Tasks | LeadFlow AI",
  description: "Manage your sales follow-up tasks and action items.",
}

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const rawTasks = await getTasks(session.user.id)

  const tasks = rawTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    isCompleted: t.isCompleted,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    lead: t.lead ? { id: t.lead.id, name: t.lead.name } : null,
    contact: t.contact
      ? { id: t.contact.id, firstName: t.contact.firstName, lastName: t.contact.lastName }
      : null,
  }))

  return <TasksClient initialTasks={tasks} />
}
