import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getDashboardData } from "@/features/dashboard/data/dashboard.data"
import { DashboardInsights } from "@/features/dashboard/components/dashboard-insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  Zap,
} from "lucide-react"

export const metadata = {
  title: "Dashboard | LeadFlow AI",
  description: "Your AI-powered sales pipeline overview.",
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const data = await getDashboardData(session.user.id)

  const stats = [
    {
      label: "Total Leads",
      value: data.leadsCount,
      sub: `${data.hotLeads} hot leads`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      href: "/leads",
    },
    {
      label: "Pipeline Value",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(data.pipelineValue),
      sub: `${data.openDealsCount} open deals`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
      href: "/deals",
    },
    {
      label: "Conversion",
      value: `${data.conversionRate}%`,
      sub: "Leads in closed stages",
      icon: TrendingUp,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-950/30",
      href: "/pipeline",
    },
    {
      label: "Open Tasks",
      value: data.tasksOpen,
      sub: "Pending follow-ups",
      icon: CheckCircle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      href: "/tasks",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Welcome back, {session.user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Here&apos;s your sales pipeline at a glance, powered by LeadFlow AI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="cursor-pointer border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{stat.label}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <CardTitle className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="flex items-center gap-1 text-xs text-neutral-500">
                  {stat.sub}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recent Leads</h2>
            <Link href="/leads" className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {data.recentLeads.length === 0 ? (
              <p className="py-4 text-sm italic text-neutral-400">
                No leads yet.{" "}
                <Link href="/leads?create=1" className="text-blue-500 underline">
                  Create your first lead
                </Link>
              </p>
            ) : (
              data.recentLeads.map((lead) => (
                <Link key={lead.id} href={`/leads/${lead.id}`}>
                  <div className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                        {lead.name}
                      </p>
                      <p className="text-xs text-neutral-400">{lead.company?.name || "No company"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-neutral-50 text-[10px] dark:bg-neutral-800">
                        {lead.stage?.name || "Unknown"}
                      </Badge>
                      <ScoreBadge score={lead.score} />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <DashboardInsights />
          <DashboardMiniBars title="Stage Distribution" items={data.stageDistribution.map((item) => ({ label: item.stageName, count: item.count }))} />
          <DashboardMiniBars title="Top Lead Sources" items={data.topSources.map((item) => ({ label: item.source.replace(/_/g, " "), count: item.count }))} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                <Calendar className="h-4 w-4 text-neutral-400" /> Upcoming Meetings
              </h2>
              <Link href="/meetings" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            </div>
            {data.upcomingMeetings.length === 0 ? (
              <p className="text-xs italic text-neutral-400">No upcoming meetings.</p>
            ) : (
              data.upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{meeting.title}</p>
                  <div className="mt-1 space-y-0.5 text-xs text-neutral-400">
                    <p>{new Date(meeting.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                    {meeting.lead && <p className="text-blue-500">{meeting.lead.name}</p>}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                <Zap className="h-4 w-4 text-neutral-400" /> Recent Activity
              </h2>
              <Link href="/activities" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            </div>
            {data.recentActivities.length === 0 ? (
              <p className="text-xs italic text-neutral-400">No activity yet.</p>
            ) : (
              <div className="space-y-2">
                {data.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-2 text-xs">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    <div className="space-y-0.5">
                      <p className="line-clamp-2 text-neutral-700 dark:text-neutral-300">{activity.description}</p>
                      <p className="text-neutral-400">{new Date(activity.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: string }) {
  const colorClass =
    score === "HOT"
      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400"
      : score === "WARM"
        ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
        : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400"

  return (
    <Badge variant="outline" className={`text-[10px] ${colorClass}`}>
      {score}
    </Badge>
  )
}

function DashboardMiniBars({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; count: number }>
}) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{title}</h2>
      <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
        {items.length === 0 ? (
          <p className="text-xs italic text-neutral-400">No data yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-neutral-600 dark:text-neutral-400">{item.label}</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
