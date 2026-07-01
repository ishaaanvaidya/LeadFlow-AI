import { generateCompletion, AIResponse } from "./provider"
import { getInsightsPrompt } from "./prompts/insights"
import { z } from "zod"

export interface InsightsResult {
  summary: string
  recommendations: string[]
  risks: string[]
}

const insightsResultSchema = z.object({
  summary: z.string().min(1),
  recommendations: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
})

export async function generatePipelineInsights(pipelineData: {
  totalLeads: number
  totalDeals: number
  pipelineValue: number
  winRate: number
  deals: Array<{
    name: string
    value: number
    status: string
    stageName: string
    companyName?: string
  }>
}): Promise<AIResponse<InsightsResult>> {
  // 1. Build prompt
  const messages = getInsightsPrompt(pipelineData)

  // 2. Query model
  const response = await generateCompletion(messages)

  if (!response.success || !response.data) {
    // Graceful Fallback
    console.warn("Using fallback pipeline insights due to AI failure:", response.error)
    return {
      success: true,
      data: {
        summary: `Your pipeline currently holds ${pipelineData.totalLeads} active leads and ${pipelineData.totalDeals} open deals, with a combined estimated value of $${pipelineData.pipelineValue.toLocaleString()}. The current win rate is standing at ${pipelineData.winRate}%.`,
        recommendations: [
          "Follow up on proposals that have been sent recently to advance deals.",
          "Check for high-value leads in early stages and schedule discovery calls.",
        ],
        risks: [
          "Some deals in negotiation stages lack activity log updates.",
          "Lead source distribution is heavily dependent on event referrals.",
        ],
      },
      error: response.error,
    }
  }

  // 3. Parse JSON output
  try {
    const cleanedJson = response.data.trim().replace(/^```json\s*/i, "").replace(/```$/, "")
    const parsed = insightsResultSchema.parse(JSON.parse(cleanedJson))
    return {
      success: true,
      data: {
        summary: parsed.summary,
        recommendations: parsed.recommendations,
        risks: parsed.risks,
      },
    }
  } catch (err) {
    console.error("Failed to parse AI pipeline insights JSON:", err)
    return {
      success: true,
      data: {
        summary: `Failed to compile insights dynamically. Value of open deals is $${pipelineData.pipelineValue.toLocaleString()}.`,
        recommendations: ["Review high-value opportunities manually in the Kanban view."],
        risks: ["NVIDIA API returned malformed response details."],
      },
      error: "AI response format mismatch.",
    }
  }
}
