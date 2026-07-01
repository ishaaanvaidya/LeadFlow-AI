import { z } from "zod"

export const createContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
})

export const updateContactSchema = createContactSchema.partial().extend({
  id: z.string().min(1, "ID is required to update a contact"),
})

export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>
