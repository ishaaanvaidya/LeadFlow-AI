import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import React from "react"
import { getLeadById } from "@/features/leads/data/leads.data"
import { LeadDetailClient } from "@/features/leads/components/lead-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const { id } = await params
  const lead = await getLeadById(session.user.id, id)

  if (!lead) {
    notFound()
  }

  // Convert Decimal and Dates to serializable types
  const serializedLead = {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    estimatedValue: lead.estimatedValue ? Number(lead.estimatedValue) : null,
    score: lead.score,
    createdAt: lead.createdAt.toISOString(),
    stage: lead.stage
      ? {
          name: lead.stage.name,
        }
      : null,
    company: lead.company
      ? {
          name: lead.company.name,
          website: lead.company.website,
          industry: lead.company.industry,
          description: lead.company.description,
        }
      : null,
    contact: lead.contact
      ? {
          firstName: lead.contact.firstName,
          lastName: lead.contact.lastName,
          email: lead.contact.email,
          phone: lead.contact.phone,
          jobTitle: lead.contact.jobTitle,
        }
      : null,
    notes: lead.notes.map((n) => ({
      id: n.id,
      content: n.content,
      createdAt: n.createdAt.toISOString(),
    })),
    tasks: lead.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      isCompleted: t.isCompleted,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    })),
    meetings: lead.meetings.map((m) => ({
      id: m.id,
      title: m.title,
      startTime: m.startTime.toISOString(),
      location: m.location,
    })),
    activities: lead.activities.map((a) => ({
      id: a.id,
      description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
    leadScores: lead.leadScores.map((ls) => ({
      score: ls.score,
      explanation: ls.explanation,
      confidence: ls.confidence,
      signals: (ls.signals || {}) as object,
    })),
    emailDrafts: lead.emailDrafts.map((ed) => ({
      subject: ed.subject,
      body: ed.body,
    })),
  }

  return <LeadDetailClient lead={serializedLead} />
}
