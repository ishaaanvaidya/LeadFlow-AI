import { z } from "zod"

export const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional().or(z.literal("")),
  leadId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
})

export const updateMeetingSchema = createMeetingSchema.partial().extend({
  id: z.string().min(1, "ID is required to update a meeting"),
})

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>
