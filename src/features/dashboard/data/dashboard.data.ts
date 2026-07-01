import "server-only"
import { db } from "@/lib/db"
import { DealStatus } from "@/generated/prisma/enums"

export interface DashboardData {
  leadsCount: number
  hotLeads: number
  openDealsCount: number
  pipelineValue: number
  winRate: number
  conversionRate: number
  tasksOpen: number
  stageDistribution: Array<{ stageName: string; count: number }>
  topSources: Array<{ source: string; count: number }>
  upcomingMeetings: Array<{
    id: string
    title: string
    startTime: string
    lead: { name: string } | null
  }>
  recentActivities: Array<{
    id: string
    description: string
    createdAt: string
    lead: { id: string; name: string } | null
  }>
  recentLeads: Array<{
    id: string
    name: string
    score: string
    stage: { name: string } | null
    company: { name: string } | null
  }>
  openDealsForInsights: Array<{
    name: string
    value: number
    status: string
    stageName: string
    companyName?: string
  }>
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [
    leadsCount,
    hotLeads,
    convertedLeads,
    dealsOpen,
    dealsWon,
    dealsLost,
    tasksOpen,
    upcomingMeetings,
    recentActivities,
    recentLeads,
    stages,
    topSources,
    openDealsForInsights,
  ] = await Promise.all([
    db.lead.count({ where: { userId, archivedAt: null } }),
    db.lead.count({ where: { userId, archivedAt: null, score: "HOT" } }),
    db.lead.count({ where: { userId, archivedAt: null, stage: { name: { contains: "Closed", mode: "insensitive" } } } }),
    db.deal.aggregate({
      where: { userId, archivedAt: null, status: DealStatus.OPEN },
      _sum: { value: true },
      _count: true,
    }),
    db.deal.count({ where: { userId, archivedAt: null, status: DealStatus.WON } }),
    db.deal.count({ where: { userId, archivedAt: null, status: DealStatus.LOST } }),
    db.task.count({ where: { userId, archivedAt: null, isCompleted: false } }),
    db.meeting.findMany({
      where: { userId, archivedAt: null, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take: 3,
      include: { lead: { select: { name: true } } },
    }),
    db.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        lead: { select: { id: true, name: true } },
      },
    }),
    db.lead.findMany({
      where: { userId, archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { stage: { select: { name: true } }, company: { select: { name: true } } },
    }),
    db.pipelineStage.findMany({
      where: { pipeline: { userId, archivedAt: null } },
      orderBy: { position: "asc" },
      select: {
        name: true,
        _count: {
          select: {
            leads: { where: { userId, archivedAt: null } },
          },
        },
      },
    }),
    db.lead.groupBy({
      by: ["source"],
      where: { userId, archivedAt: null },
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
      take: 5,
    }),
    db.deal.findMany({
      where: { userId, archivedAt: null, status: DealStatus.OPEN },
      orderBy: { value: "desc" },
      take: 8,
      include: {
        stage: { select: { name: true } },
        company: { select: { name: true } },
      },
    }),
  ])

  const totalDeals = dealsWon + dealsLost
  const pipelineValue = Number(dealsOpen._sum.value ?? 0)

  return {
    leadsCount,
    hotLeads,
    openDealsCount: dealsOpen._count,
    pipelineValue,
    winRate: totalDeals > 0 ? Math.round((dealsWon / totalDeals) * 100) : 0,
    conversionRate: leadsCount > 0 ? Math.round((convertedLeads / leadsCount) * 100) : 0,
    tasksOpen,
    stageDistribution: stages.map((stage) => ({
      stageName: stage.name,
      count: stage._count.leads,
    })),
    topSources: topSources.map((source) => ({
      source: source.source ?? "OTHER",
      count: source._count.source,
    })),
    upcomingMeetings: upcomingMeetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      startTime: meeting.startTime.toISOString(),
      lead: meeting.lead,
    })),
    recentActivities: recentActivities.map((activity) => ({
      id: activity.id,
      description: activity.description,
      createdAt: activity.createdAt.toISOString(),
      lead: activity.lead,
    })),
    recentLeads: recentLeads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      score: lead.score,
      stage: lead.stage,
      company: lead.company,
    })),
    openDealsForInsights: openDealsForInsights.map((deal) => ({
      name: deal.name,
      value: Number(deal.value),
      status: deal.status,
      stageName: deal.stage.name,
      companyName: deal.company?.name,
    })),
  }
}
