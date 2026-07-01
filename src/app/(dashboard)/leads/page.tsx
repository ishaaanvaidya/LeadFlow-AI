import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"
import { getLeads } from "@/features/leads/data/leads.data"
import { LeadsClient } from "@/features/leads/components/leads-client"

export default async function LeadsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const leads = await getLeads(session.user.id)

  // Map to simple JSON serializable structures
  const serializedLeads = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    estimatedValue: lead.estimatedValue ? Number(lead.estimatedValue) : null,
    score: lead.score,
    stage: {
      id: lead.stage.id,
      name: lead.stage.name,
    },
    company: lead.company
      ? {
          id: lead.company.id,
          name: lead.company.name,
        }
      : null,
    contact: lead.contact
      ? {
          id: lead.contact.id,
          firstName: lead.contact.firstName,
          lastName: lead.contact.lastName,
        }
      : null,
  }))

  return <LeadsClient initialLeads={serializedLeads} />
}
