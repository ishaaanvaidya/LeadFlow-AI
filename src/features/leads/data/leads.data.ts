import "server-only"
import { db } from "@/lib/db"
import { CreateLeadInput, UpdateLeadInput } from "../schemas/leads.schema"
import { ActivityType } from "@/generated/prisma/enums"

export async function getLeads(userId: string) {
  return db.lead.findMany({
    where: {
      userId,
      archivedAt: null,
    },
    include: {
      company: true,
      contact: true,
      stage: true,
      leadScores: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getLeadById(userId: string, id: string) {
  return db.lead.findFirst({
    where: {
      id,
      userId,
      archivedAt: null,
    },
    include: {
      company: true,
      contact: true,
      stage: {
        include: {
          pipeline: true,
        },
      },
      tasks: {
        where: { archivedAt: null },
        orderBy: { dueDate: "asc" },
      },
      notes: {
        where: { archivedAt: null },
        orderBy: { createdAt: "desc" },
      },
      meetings: {
        where: { archivedAt: null },
        orderBy: { startTime: "asc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
      },
      leadScores: {
        orderBy: { createdAt: "desc" },
      },
      emailDrafts: {
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function createLead(userId: string, input: CreateLeadInput) {
  const { name, email, phone, source, estimatedValue, companyId, contactId, stageId } = input

  return db.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        source: source || "OTHER",
        estimatedValue: estimatedValue || null,
        companyId: companyId || null,
        contactId: contactId || null,
        stageId,
        userId,
      },
    })

    // Log Activity
    await tx.activity.create({
      data: {
        type: ActivityType.LEAD_CREATED,
        description: `Lead "${name}" was created.`,
        userId,
        leadId: lead.id,
      },
    })

    return lead
  })
}

export async function updateLead(userId: string, id: string, input: UpdateLeadInput) {
  const { name, email, phone, source, estimatedValue, companyId, contactId, stageId } = input

  return db.$transaction(async (tx) => {
    // Verify ownership
    const existing = await tx.lead.findFirst({
      where: { id, userId, archivedAt: null },
    })

    if (!existing) {
      throw new Error("Lead not found or unauthorized")
    }

    const updated = await tx.lead.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? (email || null) : undefined,
        phone: phone !== undefined ? (phone || null) : undefined,
        source: source !== undefined ? source : undefined,
        estimatedValue: estimatedValue !== undefined ? (estimatedValue || null) : undefined,
        companyId: companyId !== undefined ? (companyId || null) : undefined,
        contactId: contactId !== undefined ? (contactId || null) : undefined,
        stageId: stageId !== undefined ? stageId : undefined,
      },
    })

    // Log Activity
    let description = `Lead "${updated.name}" was updated.`
    if (stageId && stageId !== existing.stageId) {
      const stage = await tx.pipelineStage.findUnique({ where: { id: stageId } })
      description = `Lead stage changed to "${stage?.name || "Unknown"}".`
      
      await tx.activity.create({
        data: {
          type: ActivityType.STAGE_CHANGED,
          description,
          userId,
          leadId: id,
        },
      })
    } else {
      await tx.activity.create({
        data: {
          type: ActivityType.LEAD_UPDATED,
          description,
          userId,
          leadId: id,
        },
      })
    }

    return updated
  })
}

export async function deleteLead(userId: string, id: string) {
  return db.$transaction(async (tx) => {
    const existing = await tx.lead.findFirst({
      where: { id, userId, archivedAt: null },
    })

    if (!existing) {
      throw new Error("Lead not found or unauthorized")
    }

    const archived = await tx.lead.update({
      where: { id },
      data: { archivedAt: new Date() },
    })

    // Log Activity
    await tx.activity.create({
      data: {
        type: ActivityType.OTHER,
        description: `Lead "${archived.name}" was archived.`,
        userId,
        leadId: id,
      },
    })

    return archived
  })
}
