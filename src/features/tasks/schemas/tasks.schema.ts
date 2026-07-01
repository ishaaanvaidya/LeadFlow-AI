import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  leadId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().min(1, "ID is required to update a task"),
  isCompleted: z.boolean().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
