"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as pipelinesData from "../data/pipelines.data"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getPipelinesAction() {
  try {
    const user = await requireUser()
    const data = await pipelinesData.getPipelines(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch pipelines"
    return { success: false, error: message }
  }
}

export async function getPipelineStagesAction(pipelineId?: string) {
  try {
    const user = await requireUser()
    const data = await pipelinesData.getPipelineStages(user.id, pipelineId)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch pipeline stages"
    return { success: false, error: message }
  }
}

export async function moveDealToStageAction(dealId: string, stageId: string) {
  try {
    const user = await requireUser()
    await pipelinesData.moveDealToStage(user.id, dealId, stageId)
    revalidatePath("/pipeline")
    revalidatePath("/deals")
    revalidatePath("/activities")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to move deal"
    return { success: false, error: message }
  }
}

export async function moveLeadToStageAction(leadId: string, stageId: string) {
  try {
    const user = await requireUser()
    await pipelinesData.moveLeadToStage(user.id, leadId, stageId)
    revalidatePath("/pipeline")
    revalidatePath("/leads")
    revalidatePath(`/leads/${leadId}`)
    revalidatePath("/activities")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to move lead"
    return { success: false, error: message }
  }
}
