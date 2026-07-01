import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getKanbanData } from "@/features/pipelines/data/pipelines.data"
import { PipelineKanban } from "@/features/pipelines/components/pipeline-kanban"

export const metadata = {
  title: "Pipeline | LeadFlow AI",
  description: "Kanban pipeline view for your deals and leads.",
}

export default async function PipelinePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const pipeline = await getKanbanData(session.user.id)

  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
        No pipeline found. Create a deal to auto-generate your default pipeline.
      </div>
    )
  }

  // Serialize for client — flatten deals + leads into unified KanbanCard arrays per stage
  const stages = pipeline.stages.map((stage) => {
    const dealCards = stage.deals.map((d) => ({
      id: d.id,
      name: d.name,
      value: Number(d.value),
      probability: d.probability,
      company: d.company ? { id: d.company.id, name: d.company.name } : null,
      contact: d.contact
        ? { id: d.contact.id, firstName: d.contact.firstName, lastName: d.contact.lastName }
        : null,
      type: "deal" as const,
    }))

    const leadCards = stage.leads.map((l) => ({
      id: l.id,
      name: l.name,
      estimatedValue: l.estimatedValue ? Number(l.estimatedValue) : null,
      score: l.score,
      company: l.company ? { id: l.company.id, name: l.company.name } : null,
      type: "lead" as const,
    }))

    const allCards = [...dealCards, ...leadCards]
    const totalValue =
      dealCards.reduce((sum, d) => sum + d.value, 0) +
      leadCards.reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0)

    return {
      id: stage.id,
      name: stage.name,
      position: stage.position,
      cards: allCards,
      totalValue,
    }
  })

  return <PipelineKanban stages={stages} pipelineName={pipeline.name} />
}
