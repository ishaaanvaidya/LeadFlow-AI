import "server-only"
import { db } from "@/lib/db"
import { ActivityType } from "@/generated/prisma/enums"

export async function getPipelines(userId: string) {
  return db.pipeline.findMany({
    where: { userId, archivedAt: null },
    include: { stages: { orderBy: { position: "asc" } } },
  })
}

export async function getPipelineStages(userId: string, pipelineId?: string) {
  // If no pipelineId provided, fetch from the first pipeline
  let activePipelineId = pipelineId
  if (!activePipelineId) {
    const pipeline = await db.pipeline.findFirst({
      where: { userId, archivedAt: null },
      orderBy: { createdAt: "asc" },
    })
    if (!pipeline) {
      // Gracefully create a default pipeline if none exists
      const newPipeline = await db.pipeline.create({
        data: {
          name: "Standard Sales Pipeline",
          description: "Default pipeline",
          userId,
        },
      })
      const stagesData = [
        { name: "New", position: 1 },
        { name: "Contacted", position: 2 },
        { name: "Qualified", position: 3 },
        { name: "Proposal Sent", position: 4 },
        { name: "Negotiation", position: 5 },
        { name: "Closed Won", position: 6 },
        { name: "Closed Lost", position: 7 },
      ]
      for (const s of stagesData) {
        await db.pipelineStage.create({
          data: {
            name: s.name,
            position: s.position,
            pipelineId: newPipeline.id,
          },
        })
      }
      activePipelineId = newPipeline.id
    } else {
      activePipelineId = pipeline.id
    }
  }

  return db.pipelineStage.findMany({
    where: { pipelineId: activePipelineId },
    orderBy: { position: "asc" },
  })
}

/** Returns the first pipeline with all stages and their deals for the Kanban board */
export async function getKanbanData(userId: string) {
  const pipeline = await db.pipeline.findFirst({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      stages: {
        orderBy: { position: "asc" },
        include: {
          deals: {
            where: { archivedAt: null },
            orderBy: { createdAt: "desc" },
            include: {
              company: { select: { id: true, name: true } },
              contact: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          leads: {
            where: { archivedAt: null },
            orderBy: { createdAt: "desc" },
            include: {
              company: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  })
  return pipeline
}

/** Move a deal to a different stage */
export async function moveDealToStage(userId: string, dealId: string, stageId: string) {
  return db.$transaction(async (tx) => {
    const [deal, stage] = await Promise.all([
      tx.deal.findFirst({ where: { id: dealId, userId, archivedAt: null } }),
      tx.pipelineStage.findFirst({
        where: { id: stageId, pipeline: { userId, archivedAt: null } },
        select: { id: true, name: true },
      }),
    ])

    if (!deal) throw new Error("Deal not found or unauthorized")
    if (!stage) throw new Error("Pipeline stage not found or unauthorized")

    const updated = await tx.deal.update({
      where: { id: dealId },
      data: { stageId },
    })

    await tx.activity.create({
      data: {
        type: ActivityType.STAGE_CHANGED,
        description: `Deal "${deal.name}" moved to "${stage.name}".`,
        dealId,
        userId,
      },
    })

    return updated
  })
}

/** Move a lead to a different stage */
export async function moveLeadToStage(userId: string, leadId: string, stageId: string) {
  return db.$transaction(async (tx) => {
    const [lead, stage] = await Promise.all([
      tx.lead.findFirst({ where: { id: leadId, userId, archivedAt: null } }),
      tx.pipelineStage.findFirst({
        where: { id: stageId, pipeline: { userId, archivedAt: null } },
        select: { id: true, name: true },
      }),
    ])

    if (!lead) throw new Error("Lead not found or unauthorized")
    if (!stage) throw new Error("Pipeline stage not found or unauthorized")

    const updated = await tx.lead.update({
      where: { id: leadId },
      data: { stageId },
    })

    await tx.activity.create({
      data: {
        type: ActivityType.STAGE_CHANGED,
        description: `Lead "${lead.name}" moved to "${stage.name}".`,
        leadId,
        userId,
      },
    })

    return updated
  })
}
