"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as leadsData from "../data/leads.data"
import { createLeadSchema, updateLeadSchema } from "../schemas/leads.schema"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getLeadsAction() {
  try {
    const user = await requireUser()
    const data = await leadsData.getLeads(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch leads"
    return { success: false, error: message }
  }
}

export async function getLeadByIdAction(id: string) {
  try {
    const user = await requireUser()
    const data = await leadsData.getLeadById(user.id, id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch lead"
    return { success: false, error: message }
  }
}

export async function createLeadAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createLeadSchema.parse(input)
    const data = await leadsData.createLead(user.id, parsed)
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create lead"
    return { success: false, error: message }
  }
}

export async function updateLeadAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateLeadSchema.parse({
      ...(input as Record<string, unknown>),
      id,
    })
    const data = await leadsData.updateLead(user.id, id, parsed)
    revalidatePath("/leads")
    revalidatePath(`/leads/${id}`)
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update lead"
    return { success: false, error: message }
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const user = await requireUser()
    const data = await leadsData.deleteLead(user.id, id)
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete lead"
    return { success: false, error: message }
  }
}

// AI Scoring Action
export async function generateLeadScoreAction(leadId: string) {
  try {
    const user = await requireUser()
    const lead = await leadsData.getLeadById(user.id, leadId)
    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    const notes = lead.notes.map((n) => n.content)
    const activities = lead.activities.map((a) => a.description)

    const { scoreLead } = await import("@/services/ai/lead-score")
    const aiResult = await scoreLead({
      leadName: lead.name,
      companyName: lead.company?.name,
      contactName: lead.contact ? `${lead.contact.firstName} ${lead.contact.lastName}` : undefined,
      estimatedValue: lead.estimatedValue ? Number(lead.estimatedValue) : undefined,
      source: lead.source || undefined,
      stageName: lead.stage?.name,
      notes,
      activities,
    })

    if (!aiResult.success || !aiResult.data) {
      return { success: false, error: aiResult.error || "Failed to score lead" }
    }

    // Save in database
    const { db } = await import("@/lib/db")
    const { ActivityType } = await import("@/generated/prisma/enums")
    
    await db.$transaction(async (tx) => {
      // 1. Create LeadScore history
      await tx.leadScore.create({
        data: {
          score: aiResult.data!.score,
          explanation: aiResult.data!.explanation,
          confidence: aiResult.data!.confidence,
          signals: aiResult.data!.signals as object,
          leadId,
          userId: user.id,
        },
      })

      // 2. Update Lead main score
      await tx.lead.update({
        where: { id: leadId },
        data: { score: aiResult.data!.score },
      })

      // 3. Log activity
      await tx.activity.create({
        data: {
          type: ActivityType.LEAD_SCORE_UPDATED,
          description: `Lead score evaluated as "${aiResult.data!.score}": ${aiResult.data!.explanation}`,
          leadId,
          userId: user.id,
        },
      })
    })

    revalidatePath(`/leads/${leadId}`)
    revalidatePath("/leads")
    revalidatePath("/")

    return { success: true, data: aiResult.data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate lead score"
    return { success: false, error: message }
  }
}

// AI Email Draft Action
export async function generateEmailDraftAction(leadId: string, tone?: string) {
  try {
    const user = await requireUser()
    const lead = await leadsData.getLeadById(user.id, leadId)
    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    const notes = lead.notes.map((n) => n.content)

    const { draftEmail } = await import("@/services/ai/draft-email")
    const aiResult = await draftEmail({
      leadName: lead.name,
      companyName: lead.company?.name,
      contactName: lead.contact ? `${lead.contact.firstName} ${lead.contact.lastName}` : undefined,
      estimatedValue: lead.estimatedValue ? Number(lead.estimatedValue) : undefined,
      notes,
      tone,
    })

    if (!aiResult.success || !aiResult.data) {
      return { success: false, error: aiResult.error || "Failed to draft email" }
    }

    // Save in database
    const { db } = await import("@/lib/db")
    const { ActivityType } = await import("@/generated/prisma/enums")

    const draft = await db.$transaction(async (tx) => {
      // 1. Create EmailDraft
      const newDraft = await tx.emailDraft.create({
        data: {
          subject: aiResult.data!.subject,
          body: aiResult.data!.body,
          tone: tone || "Professional",
          userId: user.id,
          leadId,
        },
      })

      // 2. Log activity
      await tx.activity.create({
        data: {
          type: ActivityType.EMAIL_DRAFT_GENERATED,
          description: `AI Email Draft generated: "${aiResult.data!.subject}"`,
          leadId,
          userId: user.id,
        },
      })

      return newDraft
    })

    revalidatePath(`/leads/${leadId}`)
    revalidatePath("/leads")
    revalidatePath("/")

    return { success: true, data: draft }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate email draft"
    return { success: false, error: message }
  }
}
