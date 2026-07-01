import { z } from "zod"
import { LeadSource, LeadScoreValue } from "@/generated/prisma/enums"

export const leadSourceSchema = z.nativeEnum(LeadSource)
export const leadScoreValueSchema = z.nativeEnum(LeadScoreValue)

export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  source: leadSourceSchema,
  estimatedValue: z.number().nonnegative("Value must be a positive number").optional().or(z.literal(0)),
  companyId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
  stageId: z.string().min(1, "Pipeline stage is required"),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().min(1, "ID is required to update a lead"),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
