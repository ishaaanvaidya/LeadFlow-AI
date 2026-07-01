"use client"

import * as React from "react"
import { Sparkles, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateDashboardInsightsAction } from "../actions/dashboard.actions"
import type { InsightsResult } from "@/services/ai/insights"

export function DashboardInsights() {
  const [insights, setInsights] = React.useState<InsightsResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    const result = await generateDashboardInsightsAction()
    setIsLoading(false)

    if (result.success && result.data) {
      setInsights(result.data)
      if (result.error) {
        setError("Using safe fallback insights while AI is unavailable.")
      }
      return
    }

    setError(result.error || "AI insights are temporarily unavailable.")
  }

  return (
    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Sparkles className="h-4 w-4 text-blue-500" />
            AI Pipeline Insights
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Generate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {insights ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{insights.summary}</p>
            <InsightList title="Recommended next actions" items={insights.recommendations} />
            <InsightList title="Watch points" items={insights.risks} />
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Generate a short, editable sales-readiness summary from current pipeline metrics. The CRM remains fully usable if AI is offline.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
      <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
        {items.slice(0, 3).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
