import "server-only"
import { db } from "@/lib/db"

export async function getActivities(userId: string, limit = 50) {
  return db.activity.findMany({
    where: { userId },
    include: {
      lead: { select: { id: true, name: true } },
      deal: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getActivitiesByLead(userId: string, leadId: string) {
  return db.activity.findMany({
    where: { userId, leadId },
    orderBy: { createdAt: "desc" },
  })
}
