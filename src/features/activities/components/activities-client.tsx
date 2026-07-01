"use client"

import * as React from "react"
import Link from "next/link"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"

interface ActivityItem {
  id: string
  type: string
  description: string
  createdAt: string
  lead: { id: string; name: string } | null
  deal: { id: string; name: string } | null
}

interface ActivitiesClientProps {
  initialActivities: ActivityItem[]
}

const TYPE_COLOR: Record<string, string> = {
  LEAD_CREATED: "bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  LEAD_UPDATED: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  LEAD_SCORE_UPDATED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  EMAIL_DRAFT_GENERATED: "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400",
  NOTE_ADDED: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  DEAL_CREATED: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  DEAL_UPDATED: "bg-teal-100 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400",
  MEETING_SCHEDULED: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
  TASK_COMPLETED: "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400",
}

export function ActivitiesClient({ initialActivities }: ActivitiesClientProps) {
  const [activities] = React.useState<ActivityItem[]>(initialActivities)

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Activity Feed"
          description="Real-time audit trail of all CRM actions and AI-generated events."
        />

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No activity yet</p>
            <p className="text-xs text-neutral-400 mt-1">Activity is logged automatically as you use LeadFlow AI.</p>
          </div>
        ) : (
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 space-y-0">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-6 pb-6 group">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-blue-400 transition-colors" />

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TYPE_COLOR[activity.type] || "bg-neutral-100 text-neutral-600"}`}>
                          {activity.type.replace(/_/g, " ")}
                        </span>
                        {activity.lead && (
                          <Link
                            href={`/leads/${activity.lead.id}`}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            {activity.lead.name}
                          </Link>
                        )}
                        {activity.deal && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {activity.deal.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-snug">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
