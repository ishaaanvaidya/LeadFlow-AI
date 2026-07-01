import "server-only"
import { db } from "@/lib/db"
import { CreateDealInput, UpdateDealInput } from "../schemas/deals.schema"
import { DealStatus } from "@/generated/prisma/enums"

export async function getDeals(userId: string) {
  return db.deal.findMany({
    where: { userId, archivedAt: null },
    include: {
      company: true,
      contact: true,
      stage: true,
      lead: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getDealById(userId: string, id: string) {
  return db.deal.findFirst({
    where: { id, userId, archivedAt: null },
    include: {
      company: true,
      contact: true,
      stage: true,
      lead: true,
    },
  })
}

export async function createDeal(userId: string, input: CreateDealInput) {
  const { name, value, probability, closeDate, status, leadId, companyId, contactId, stageId } = input

  return db.deal.create({
    data: {
      name,
      value,
      probability,
      closeDate: closeDate ? new Date(closeDate) : null,
      status: status || DealStatus.OPEN,
      leadId: leadId || null,
      companyId: companyId || null,
      contactId: contactId || null,
      stageId,
      userId,
    },
  })
}

export async function updateDeal(userId: string, id: string, input: UpdateDealInput) {
  const { name, value, probability, closeDate, status, leadId, companyId, contactId, stageId } = input

  // Verify ownership
  const existing = await db.deal.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Deal not found or unauthorized")
  }

  return db.deal.update({
    where: { id },
    data: {
      name: name !== undefined ? name : undefined,
      value: value !== undefined ? value : undefined,
      probability: probability !== undefined ? probability : undefined,
      closeDate: closeDate !== undefined ? (closeDate ? new Date(closeDate) : null) : undefined,
      status: status !== undefined ? status : undefined,
      leadId: leadId !== undefined ? (leadId || null) : undefined,
      companyId: companyId !== undefined ? (companyId || null) : undefined,
      contactId: contactId !== undefined ? (contactId || null) : undefined,
      stageId: stageId !== undefined ? stageId : undefined,
    },
  })
}

export async function deleteDeal(userId: string, id: string) {
  // Verify ownership
  const existing = await db.deal.findFirst({
    where: { id, userId, archivedAt: null },
  })
  if (!existing) {
    throw new Error("Deal not found or unauthorized")
  }

  return db.deal.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}
