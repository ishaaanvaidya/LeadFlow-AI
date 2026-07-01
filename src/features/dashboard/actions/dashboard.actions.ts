"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getDashboardData } from "../data/dashboard.data"
import { generatePipelineInsights, type InsightsResult } from "@/services/ai/insights"

export async function generateDashboardInsightsAction(): Promise<{
  success: boolean
  data?: InsightsResult
  error?: string
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const dashboard = await getDashboardData(session.user.id)
    const result = await generatePipelineInsights({
      totalLeads: dashboard.leadsCount,
      totalDeals: dashboard.openDealsCount,
      pipelineValue: dashboard.pipelineValue,
      winRate: dashboard.winRate,
      deals: dashboard.openDealsForInsights,
    })

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "AI insights are temporarily unavailable." }
    }

    return { success: true, data: result.data, error: result.error }
  } catch {
    return { success: false, error: "AI insights are temporarily unavailable." }
  }
}
