import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getDeals } from "@/features/deals/data/deals.data"
import { DealsClient } from "@/features/deals/components/deals-client"

export const metadata = {
  title: "Deals | LeadFlow AI",
  description: "Manage your sales opportunities and pipeline deals.",
}

export default async function DealsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const rawDeals = await getDeals(session.user.id)

  // Serialize Decimal and Date objects for client components
  const deals = rawDeals.map((d) => ({
    id: d.id,
    name: d.name,
    value: Number(d.value),
    probability: d.probability,
    closeDate: d.closeDate ? d.closeDate.toISOString() : null,
    status: d.status,
    leadId: d.leadId,
    stage: { id: d.stage.id, name: d.stage.name },
    company: d.company ? { id: d.company.id, name: d.company.name } : null,
    contact: d.contact
      ? { id: d.contact.id, firstName: d.contact.firstName, lastName: d.contact.lastName }
      : null,
  }))

  return <DealsClient initialDeals={deals} />
}
