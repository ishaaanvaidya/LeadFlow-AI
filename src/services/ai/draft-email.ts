import { generateCompletion, AIResponse } from "./provider"
import { getEmailPrompt } from "./prompts/email"
import { z } from "zod"

export interface EmailDraftResult {
  subject: string
  body: string
}

const emailDraftResultSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})

export async function draftEmail(context: {
  leadName: string
  companyName?: string
  contactName?: string
  estimatedValue?: number
  notes?: string[]
  tone?: string
}): Promise<AIResponse<EmailDraftResult>> {
  // 1. Build prompt
  const messages = getEmailPrompt(context)

  // 2. Query model
  const response = await generateCompletion(messages)

  if (!response.success || !response.data) {
    // Graceful Fallback
    console.warn("Using fallback email draft due to AI failure:", response.error)
    return {
      success: true, // We return true to allow UI to continue with the fallback draft!
      data: {
        subject: `Follow up regarding ${context.leadName}`,
        body: `Hi ${context.contactName || "there"},\n\nI hope this email finds you well.\n\nI wanted to follow up on our discussion regarding the ${context.leadName} opportunity at ${context.companyName || "your company"}. I would love to connect next week to discuss how we can support you.\n\nBest regards,\nSales Team`,
      },
      error: response.error, // Pass along the warning for logging
    }
  }

  // 3. Parse JSON output
  try {
    const cleanedJson = response.data.trim().replace(/^```json\s*/i, "").replace(/```$/, "")
    const parsed = emailDraftResultSchema.parse(JSON.parse(cleanedJson))
    return { success: true, data: parsed }
  } catch (err) {
    console.error("Failed to parse AI email draft JSON:", err)
    return {
      success: true, // Fallback even on parsing errors
      data: {
        subject: `Follow up regarding ${context.leadName}`,
        body: response.data || `Hi ${context.contactName || "there"},\n\nI'm following up on the ${context.leadName} opportunity. Looking forward to your response.\n\nBest regards,\nSales Team`,
      },
      error: "AI returned unstructured content; showing direct response.",
    }
  }
}
