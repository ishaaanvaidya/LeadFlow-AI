import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getActivities } from "@/features/activities/data/activities.data"
import { ActivitiesClient } from "@/features/activities/components/activities-client"

export const metadata = {
  title: "Activity Feed | LeadFlow AI",
  description: "Real-time audit trail of all CRM actions.",
}

export default async function ActivitiesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const rawActivities = await getActivities(session.user.id, 100)

  const activities = rawActivities.map((a) => ({
    id: a.id,
    type: a.type,
    description: a.description,
    createdAt: a.createdAt.toISOString(),
    lead: a.lead ? { id: a.lead.id, name: a.lead.name } : null,
    deal: a.deal ? { id: a.deal.id, name: a.deal.name } : null,
  }))

  return <ActivitiesClient initialActivities={activities} />
}
