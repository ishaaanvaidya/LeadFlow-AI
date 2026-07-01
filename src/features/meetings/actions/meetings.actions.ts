"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as meetingsData from "../data/meetings.data"
import { createMeetingSchema, updateMeetingSchema } from "../schemas/meetings.schema"

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function getMeetingsAction() {
  try {
    const user = await requireUser()
    const data = await meetingsData.getMeetings(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch meetings"
    return { success: false, error: message }
  }
}

export async function createMeetingAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createMeetingSchema.parse(input)
    const data = await meetingsData.createMeeting(user.id, parsed)
    revalidatePath("/meetings")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create meeting"
    return { success: false, error: message }
  }
}

export async function updateMeetingAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateMeetingSchema.parse({ ...(input as Record<string, unknown>), id })
    const data = await meetingsData.updateMeeting(user.id, id, parsed)
    revalidatePath("/meetings")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update meeting"
    return { success: false, error: message }
  }
}

export async function deleteMeetingAction(id: string) {
  try {
    const user = await requireUser()
    await meetingsData.deleteMeeting(user.id, id)
    revalidatePath("/meetings")
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete meeting"
    return { success: false, error: message }
  }
}
