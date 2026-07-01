import "server-only"
import { db } from "@/lib/db"

export interface SearchResult {
  id: string
  type: "lead" | "company" | "contact" | "deal"
  title: string
  subtitle: string
  href: string
}

export async function searchCrm(userId: string, query: string): Promise<SearchResult[]> {
  const q = query.trim()

  if (q.length < 2) {
    return []
  }

  const [leads, companies, contacts, deals] = await Promise.all([
    db.lead.findMany({
      where: {
        userId,
        archivedAt: null,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { company: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 5,
      include: { company: { select: { name: true } } },
    }),
    db.company.findMany({
      where: {
        userId,
        archivedAt: null,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { industry: { contains: q, mode: "insensitive" } },
          { website: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    db.contact.findMany({
      where: {
        userId,
        archivedAt: null,
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { company: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 5,
      include: { company: { select: { name: true } } },
    }),
    db.deal.findMany({
      where: {
        userId,
        archivedAt: null,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { company: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 5,
      include: { company: { select: { name: true } } },
    }),
  ])

  return [
    ...leads.map((lead) => ({
      id: lead.id,
      type: "lead" as const,
      title: lead.name,
      subtitle: lead.company?.name || lead.email || "Lead",
      href: `/leads/${lead.id}`,
    })),
    ...companies.map((company) => ({
      id: company.id,
      type: "company" as const,
      title: company.name,
      subtitle: company.website || company.industry || "Company",
      href: "/companies",
    })),
    ...contacts.map((contact) => ({
      id: contact.id,
      type: "contact" as const,
      title: `${contact.firstName} ${contact.lastName}`,
      subtitle: contact.company?.name || contact.email || "Contact",
      href: "/contacts",
    })),
    ...deals.map((deal) => ({
      id: deal.id,
      type: "deal" as const,
      title: deal.name,
      subtitle: deal.company?.name || `$${Number(deal.value).toLocaleString()}`,
      href: "/deals",
    })),
  ]
}
