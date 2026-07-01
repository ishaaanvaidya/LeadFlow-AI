import "server-only"
import { db } from "@/lib/db"
import { CreateCompanyInput, UpdateCompanyInput } from "../schemas/companies.schema"

export async function getCompanies(userId: string) {
  return db.company.findMany({
    where: { userId, archivedAt: null },
    include: {
      contacts: { where: { archivedAt: null } },
      leads: { where: { archivedAt: null } },
      deals: { where: { archivedAt: null } },
    },
    orderBy: { name: "asc" },
  })
}

export async function getCompanyById(userId: string, id: string) {
  return db.company.findFirst({
    where: { id, userId, archivedAt: null },
    include: {
      contacts: { where: { archivedAt: null } },
      leads: { where: { archivedAt: null } },
      deals: { where: { archivedAt: null } },
    },
  })
}

export async function createCompany(userId: string, input: CreateCompanyInput) {
  const { name, industry, website, description } = input
  return db.company.create({
    data: {
      name,
      industry: industry || null,
      website: website || null,
      description: description || null,
      userId,
    },
  })
}

export async function updateCompany(userId: string, id: string, input: UpdateCompanyInput) {
  const { name, industry, website, description } = input

  // Verify ownership
  const existing = await db.company.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Company not found or unauthorized")
  }

  return db.company.update({
    where: { id },
    data: {
      name: name !== undefined ? name : undefined,
      industry: industry !== undefined ? (industry || null) : undefined,
      website: website !== undefined ? (website || null) : undefined,
      description: description !== undefined ? (description || null) : undefined,
    },
  })
}

export async function deleteCompany(userId: string, id: string) {
  // Verify ownership
  const existing = await db.company.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Company not found or unauthorized")
  }

  return db.company.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}
