"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/data-table"
import { SearchInput } from "@/components/common/search-input"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeadDialog } from "./lead-dialog"
import { deleteLeadAction } from "../actions/leads.actions"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, ArrowUpRight } from "lucide-react"
import { LeadSource } from "@/generated/prisma/enums"

interface LeadItem {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  estimatedValue: number | null
  score: string
  stage: { id: string; name: string }
  company: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
}

interface LeadsClientProps {
  initialLeads: LeadItem[]
}

export function LeadsClient({ initialLeads }: LeadsClientProps) {
  const searchParams = useSearchParams()
  const [leads, setLeads] = React.useState<LeadItem[]>(initialLeads)
  const [search, setSearch] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editLead, setEditLead] = React.useState<LeadItem | null>(null)

  const reloadLeads = React.useCallback(() => {
    // In Next.js, we can do a hard window reload or fetch client-side
    // Let's reload window or fetch to trigger server component re-rendering
    window.location.reload()
  }, [])

  // Filter leads by search term
  const filteredLeads = React.useMemo(() => {
    if (!search) return leads
    const s = search.toLowerCase()
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        (l.company?.name || "").toLowerCase().includes(s) ||
        (l.contact ? `${l.contact.firstName} ${l.contact.lastName}` : "").toLowerCase().includes(s)
    )
  }, [leads, search])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const res = await deleteLeadAction(id)
      if (res.success) {
        toast.success("Lead deleted successfully")
        setLeads((prev) => prev.filter((l) => l.id !== id))
      } else {
        toast.error(res.error || "Failed to delete lead")
      }
    }
  }

  const columns = [
    {
      header: "Lead Name",
      accessorKey: "name",
      cell: (item: LeadItem) => (
        <Link
          href={`/leads/${item.id}`}
          className="font-medium text-neutral-900 hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400 flex items-center gap-1 group"
        >
          {item.name}
          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      ),
    },
    {
      header: "Company",
      accessorKey: "company.name",
      cell: (item: LeadItem) => item.company?.name || <span className="text-neutral-400">-</span>,
    },
    {
      header: "Contact Person",
      accessorKey: "contact",
      cell: (item: LeadItem) =>
        item.contact ? (
          <span>
            {item.contact.firstName} {item.contact.lastName}
          </span>
        ) : (
          <span className="text-neutral-400">-</span>
        ),
    },
    {
      header: "Stage",
      accessorKey: "stage.name",
      cell: (item: LeadItem) => (
        <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          {item.stage.name}
        </Badge>
      ),
    },
    {
      header: "AI Score",
      accessorKey: "score",
      cell: (item: LeadItem) => {
        const score = item.score
        const variant = "outline" as const
        let colorClass = ""

        if (score === "HOT") {
          colorClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
        } else if (score === "WARM") {
          colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50"
        } else if (score === "COLD") {
          colorClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
        }

        return (
          <Badge variant={variant} className={colorClass}>
            {score}
          </Badge>
        )
      },
    },
    {
      header: "Estimated Value",
      accessorKey: "estimatedValue",
      cell: (item: LeadItem) => {
        const val = Number(item.estimatedValue)
        if (!val) return <span className="text-neutral-400">-</span>
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val)
      },
    },
    {
      header: "",
      accessorKey: "actions",
      className: "text-right w-[80px]",
      cell: (item: LeadItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 focus:outline-none cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <DropdownMenuItem
              onClick={() => setEditLead(item)}
              className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Delete Lead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Leads"
          description="Manage active deals and customer outreach processes."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Lead
            </Button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search leads by name, company, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredLeads}
          emptyTitle="No leads found"
          emptyDescription="Create your first lead to begin tracking conversations."
        />

        <LeadDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadLeads} />

        {editLead && (
          <LeadDialog
            isOpen={!!editLead}
            onClose={() => setEditLead(null)}
            leadId={editLead.id}
            initialData={{
              name: editLead.name,
              email: editLead.email || "",
              phone: editLead.phone || "",
              source: editLead.source as LeadSource,
              estimatedValue: Number(editLead.estimatedValue) || 0,
              companyId: editLead.company?.id || "",
              contactId: editLead.contact?.id || "",
              stageId: editLead.stage.id,
            }}
            onSuccess={reloadLeads}
          />
        )}
      </div>
    </PageContainer>
  )
}
