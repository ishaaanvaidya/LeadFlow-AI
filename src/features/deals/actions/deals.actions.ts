"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as dealsData from "../data/deals.data"
import { createDealSchema, updateDealSchema } from "../schemas/deals.schema"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getDealsAction() {
  try {
    const user = await requireUser()
    const data = await dealsData.getDeals(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch deals"
    return { success: false, error: message }
  }
}

export async function getDealByIdAction(id: string) {
  try {
    const user = await requireUser()
    const data = await dealsData.getDealById(user.id, id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch deal"
    return { success: false, error: message }
  }
}

export async function createDealAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createDealSchema.parse(input)
    const data = await dealsData.createDeal(user.id, parsed)
    revalidatePath("/deals")
    revalidatePath("/pipeline")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create deal"
    return { success: false, error: message }
  }
}

export async function updateDealAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateDealSchema.parse({
      ...(input as Record<string, unknown>),
      id,
    })
    const data = await dealsData.updateDeal(user.id, id, parsed)
    revalidatePath("/deals")
    revalidatePath("/pipeline")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update deal"
    return { success: false, error: message }
  }
}

export async function deleteDealAction(id: string) {
  try {
    const user = await requireUser()
    const data = await dealsData.deleteDeal(user.id, id)
    revalidatePath("/deals")
    revalidatePath("/pipeline")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete deal"
    return { success: false, error: message }
  }
}
