import { generateCompletion, AIResponse } from "./provider"
import { getLeadScorePrompt } from "./prompts/lead-score"
import { LeadScoreValue } from "@/generated/prisma/enums"
import { z } from "zod"

export interface LeadScoreResult {
  score: LeadScoreValue
  explanation: string
  confidence: number
  signals: {
    positive: string[]
    negative: string[]
  }
}

const leadScoreResponseSchema = z.object({
  score: z.string().min(1),
  explanation: z.string().optional(),
  confidence: z.coerce.number().optional(),
  signals: z.object({
    positive: z.array(z.string()).optional(),
    negative: z.array(z.string()).optional(),
  }).optional(),
})

export async function scoreLead(context: {
  leadName: string
  companyName?: string
  contactName?: string
  estimatedValue?: number
  source?: string
  stageName?: string
  notes?: string[]
  activities?: string[]
}): Promise<AIResponse<LeadScoreResult>> {
  // 1. Build prompt
  const messages = getLeadScorePrompt(context)

  // 2. Query model
  const response = await generateCompletion(messages)

  if (!response.success || !response.data) {
    // Graceful Fallback
    console.warn("Using fallback lead score due to AI failure:", response.error)
    const fallbackScore = (context.estimatedValue && context.estimatedValue > 100000)
      ? LeadScoreValue.HOT
      : LeadScoreValue.WARM

    return {
      success: true,
      data: {
        score: fallbackScore,
        explanation: `Calculated heuristically based on opportunity value of $${(context.estimatedValue || 0).toLocaleString()}. AI scoring service is currently unavailable.`,
        confidence: 0.5,
        signals: {
          positive: ["Opportunity estimated value is set"],
          negative: ["AI service is offline"],
        },
      },
      error: response.error,
    }
  }

  // 3. Parse JSON output
  try {
    const cleanedJson = response.data.trim().replace(/^```json\s*/i, "").replace(/```$/, "")
    const parsed = leadScoreResponseSchema.parse(JSON.parse(cleanedJson))
    
    // Normalize score
    let score: LeadScoreValue = LeadScoreValue.UNKNOWN
    const incomingScore = String(parsed.score).toUpperCase()
    if (incomingScore.includes("HOT")) score = LeadScoreValue.HOT
    else if (incomingScore.includes("WARM")) score = LeadScoreValue.WARM
    else if (incomingScore.includes("COLD")) score = LeadScoreValue.COLD

    return {
      success: true,
      data: {
        score,
        explanation: parsed.explanation || "No explanation provided.",
        confidence: Number(parsed.confidence) || 0.7,
        signals: {
          positive: parsed.signals?.positive ?? [],
          negative: parsed.signals?.negative ?? [],
        },
      },
    }
  } catch (err) {
    console.error("Failed to parse AI lead score JSON:", err)
    return {
      success: true,
      data: {
        score: LeadScoreValue.WARM,
        explanation: "Scored as WARM due to parsing error on raw AI response.",
        confidence: 0.5,
        signals: {
          positive: ["Raw output received"],
          negative: ["JSON parse error"],
        },
      },
      error: "AI response format mismatch.",
    }
  }
}
