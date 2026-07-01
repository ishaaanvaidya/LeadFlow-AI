"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as tasksData from "../data/tasks.data"
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schema"

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function getTasksAction() {
  try {
    const user = await requireUser()
    const data = await tasksData.getTasks(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tasks"
    return { success: false, error: message }
  }
}

export async function createTaskAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createTaskSchema.parse(input)
    const data = await tasksData.createTask(user.id, parsed)
    revalidatePath("/tasks")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task"
    return { success: false, error: message }
  }
}

export async function updateTaskAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateTaskSchema.parse({ ...(input as Record<string, unknown>), id })
    const data = await tasksData.updateTask(user.id, id, parsed)
    revalidatePath("/tasks")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task"
    return { success: false, error: message }
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const user = await requireUser()
    await tasksData.deleteTask(user.id, id)
    revalidatePath("/tasks")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task"
    return { success: false, error: message }
  }
}

export async function completeTaskAction(id: string) {
  try {
    const user = await requireUser()
    await tasksData.completeTask(user.id, id)
    revalidatePath("/tasks")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete task"
    return { success: false, error: message }
  }
}
