import { z } from "zod"
import { DealStatus } from "@/generated/prisma/enums"

export const dealStatusSchema = z.nativeEnum(DealStatus)

export const createDealSchema = z.object({
  name: z.string().min(1, "Deal name is required"),
  value: z.number().positive("Value must be a positive number"),
  probability: z.number().min(0).max(100),
  closeDate: z.string().optional().or(z.literal("")),
  status: dealStatusSchema,
  leadId: z.string().optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
  stageId: z.string().min(1, "Pipeline stage is required"),
})

export const updateDealSchema = createDealSchema.partial().extend({
  id: z.string().min(1, "ID is required to update a deal"),
})

export type CreateDealInput = z.infer<typeof createDealSchema>
export type UpdateDealInput = z.infer<typeof updateDealSchema>
