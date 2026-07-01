import { z } from "zod"

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
})

export const updateCompanySchema = createCompanySchema.partial().extend({
  id: z.string().min(1, "ID is required to update a company"),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
