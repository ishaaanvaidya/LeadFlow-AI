"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import * as companiesData from "../data/companies.data"
import { createCompanySchema, updateCompanySchema } from "../schemas/companies.schema"

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getCompaniesAction() {
  try {
    const user = await requireUser()
    const data = await companiesData.getCompanies(user.id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch companies"
    return { success: false, error: message }
  }
}

export async function getCompanyByIdAction(id: string) {
  try {
    const user = await requireUser()
    const data = await companiesData.getCompanyById(user.id, id)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch company"
    return { success: false, error: message }
  }
}

export async function createCompanyAction(input: unknown) {
  try {
    const user = await requireUser()
    const parsed = createCompanySchema.parse(input)
    const data = await companiesData.createCompany(user.id, parsed)
    revalidatePath("/companies")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create company"
    return { success: false, error: message }
  }
}

export async function updateCompanyAction(id: string, input: unknown) {
  try {
    const user = await requireUser()
    const parsed = updateCompanySchema.parse({
      ...(input as Record<string, unknown>),
      id,
    })
    const data = await companiesData.updateCompany(user.id, id, parsed)
    revalidatePath("/companies")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update company"
    return { success: false, error: message }
  }
}

export async function deleteCompanyAction(id: string) {
  try {
    const user = await requireUser()
    const data = await companiesData.deleteCompany(user.id, id)
    revalidatePath("/companies")
    revalidatePath("/leads")
    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete company"
    return { success: false, error: message }
  }
}
