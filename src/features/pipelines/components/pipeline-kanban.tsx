"use client"

import * as React from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { moveDealToStageAction, moveLeadToStageAction } from "../../pipelines/actions/pipelines.actions"
import { DollarSign, User, Building } from "lucide-react"

interface KanbanDeal {
  id: string
  name: string
  value: number
  probability: number
  company: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
  type: "deal"
}

interface KanbanLead {
  id: string
  name: string
  estimatedValue: number | null
  score: string
  company: { id: string; name: string } | null
  type: "lead"
}

type KanbanCard = KanbanDeal | KanbanLead

interface KanbanStage {
  id: string
  name: string
  position: number
  cards: KanbanCard[]
  totalValue: number
}

interface PipelineKanbanProps {
  stages: KanbanStage[]
  pipelineName: string
}

export function PipelineKanban({ stages: initialStages, pipelineName }: PipelineKanbanProps) {
  const [stages, setStages] = React.useState<KanbanStage[]>(initialStages)
  const [draggingCard, setDraggingCard] = React.useState<{ card: KanbanCard; fromStageId: string } | null>(null)
  const [dragOverStageId, setDragOverStageId] = React.useState<string | null>(null)

  const handleDragStart = (card: KanbanCard, fromStageId: string) => {
    setDraggingCard({ card, fromStageId })
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDragOverStageId(stageId)
  }

  const handleDrop = async (e: React.DragEvent, toStageId: string) => {
    e.preventDefault()
    setDragOverStageId(null)

    if (!draggingCard || draggingCard.fromStageId === toStageId) {
      setDraggingCard(null)
      return
    }

    const { card, fromStageId } = draggingCard
    setDraggingCard(null)

    // Optimistic update
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === fromStageId) {
          return { ...stage, cards: stage.cards.filter((c) => c.id !== card.id) }
        }
        if (stage.id === toStageId) {
          return { ...stage, cards: [card, ...stage.cards] }
        }
        return stage
      })
    )

    // Persist to server
    try {
      let result
      if (card.type === "deal") {
        result = await moveDealToStageAction(card.id, toStageId)
      } else {
        result = await moveLeadToStageAction(card.id, toStageId)
      }
      if (!result.success) {
        toast.error(result.error || "Failed to move card")
        // Revert
        setStages(initialStages)
      }
    } catch {
      toast.error("Failed to move card")
      setStages(initialStages)
    }
  }

  const handleDragEnd = () => {
    setDraggingCard(null)
    setDragOverStageId(null)
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 h-full">
        <SectionHeader
          title="Pipeline"
          description={`Kanban view — ${pipelineName}`}
        />

        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
          {stages.map((stage) => (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragLeave={() => setDragOverStageId(null)}
              className={[
                "flex flex-col gap-3 min-w-[280px] max-w-[280px] rounded-xl border p-3 transition-colors",
                dragOverStageId === stage.id
                  ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-700"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50",
              ].join(" ")}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{stage.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {stage.cards.length} card{stage.cards.length !== 1 ? "s" : ""}
                    {stage.totalValue > 0 && (
                      <span className="ml-1">
                        · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(stage.totalValue)}
                      </span>
                    )}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {stage.cards.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[calc(100vh-260px)]">
                {stage.cards.map((card) => (
                  <KanbanCardItem
                    key={`${card.type}-${card.id}`}
                    card={card}
                    stageId={stage.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggingCard?.card.id === card.id}
                  />
                ))}

                {stage.cards.length === 0 && (
                  <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

// ─── Card Item Component ────────────────────────────────────────────────────

interface KanbanCardItemProps {
  card: KanbanCard
  stageId: string
  onDragStart: (card: KanbanCard, stageId: string) => void
  onDragEnd: () => void
  isDragging: boolean
}

function KanbanCardItem({ card, stageId, onDragStart, onDragEnd, isDragging }: KanbanCardItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(card, stageId)}
      onDragEnd={onDragEnd}
      className={[
        "group rounded-lg border bg-white dark:bg-neutral-900 p-3 cursor-grab active:cursor-grabbing",
        "shadow-sm hover:shadow-md transition-all duration-150",
        isDragging ? "opacity-50 scale-95" : "opacity-100",
        card.type === "deal"
          ? "border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700"
          : "border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-700",
      ].join(" ")}
    >
      {/* Type pill */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={[
            "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
            card.type === "deal"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              : "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
          ].join(" ")}
        >
          {card.type === "deal" ? "Deal" : "Lead"}
        </span>

        {card.type === "lead" && (
          <span className={[
            "text-[10px] font-bold px-1.5 py-0.5 rounded",
            card.score === "HOT" ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
            card.score === "WARM" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400" :
            "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
          ].join(" ")}>
            {card.score}
          </span>
        )}
      </div>

      {/* Card Name */}
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug mb-2 line-clamp-2">
        {card.name}
      </p>

      {/* Meta info */}
      <div className="space-y-1">
        {card.type === "deal" && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <DollarSign className="h-3 w-3 text-green-500" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(card.value)}
              </span>
              <span className="text-neutral-400">({card.probability}%)</span>
            </div>
            {card.contact && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <User className="h-3 w-3" />
                {card.contact.firstName} {card.contact.lastName}
              </div>
            )}
          </>
        )}

        {card.type === "lead" && card.estimatedValue && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <DollarSign className="h-3 w-3 text-green-500" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(card.estimatedValue)}
            </span>
          </div>
        )}

        {card.company && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Building className="h-3 w-3" />
            {card.company.name}
          </div>
        )}
      </div>
    </div>
  )
}
