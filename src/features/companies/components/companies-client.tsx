"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/data-table"
import { SearchInput } from "@/components/common/search-input"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CompanyDialog } from "./company-dialog"
import { deleteCompanyAction } from "../actions/companies.actions"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, ExternalLink } from "lucide-react"

interface CompanyItem {
  id: string
  name: string
  industry: string | null
  website: string | null
  description: string | null
  contacts: { id: string }[]
  leads: { id: string }[]
}

interface CompaniesClientProps {
  initialCompanies: CompanyItem[]
}

export function CompaniesClient({ initialCompanies }: CompaniesClientProps) {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = React.useState<CompanyItem[]>(initialCompanies)
  const [search, setSearch] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editCompany, setEditCompany] = React.useState<CompanyItem | null>(null)

  const reloadCompanies = React.useCallback(() => {
    window.location.reload()
  }, [])

  const filteredCompanies = React.useMemo(() => {
    if (!search) return companies
    const s = search.toLowerCase()
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.industry || "").toLowerCase().includes(s) ||
        (c.description || "").toLowerCase().includes(s)
    )
  }, [companies, search])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this company? Warning: related leads will lose company association.")) {
      const res = await deleteCompanyAction(id)
      if (res.success) {
        toast.success("Company deleted successfully")
        setCompanies((prev) => prev.filter((c) => c.id !== id))
      } else {
        toast.error(res.error || "Failed to delete company")
      }
    }
  }

  const columns = [
    {
      header: "Company Name",
      accessorKey: "name",
      cell: (item: CompanyItem) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</span>
      ),
    },
    {
      header: "Industry",
      accessorKey: "industry",
      cell: (item: CompanyItem) => item.industry || <span className="text-neutral-400">-</span>,
    },
    {
      header: "Website",
      accessorKey: "website",
      cell: (item: CompanyItem) =>
        item.website ? (
          <a
            href={`https://${item.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            {item.website}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-neutral-400">-</span>
        ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item: CompanyItem) => (
        <span className="text-neutral-600 dark:text-neutral-400 line-clamp-1 max-w-[250px]">
          {item.description || "-"}
        </span>
      ),
    },
    {
      header: "Team Size",
      accessorKey: "contacts.length",
      cell: (item: CompanyItem) => (
        <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {item.contacts.length} {item.contacts.length === 1 ? "person" : "people"}
        </Badge>
      ),
    },
    {
      header: "Pipeline Leads",
      accessorKey: "leads.length",
      cell: (item: CompanyItem) => (
        <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {item.leads.length} active
        </Badge>
      ),
    },
    {
      header: "",
      accessorKey: "actions",
      className: "text-right w-[80px]",
      cell: (item: CompanyItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 focus:outline-none cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <DropdownMenuItem
              onClick={() => setEditCompany(item)}
              className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Delete Company
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
          title="Companies"
          description="Maintain target client account logs and industry scoping."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Company
            </Button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search companies by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredCompanies}
          emptyTitle="No companies found"
          emptyDescription="Add companies to segment your CRM accounts."
        />

        <CompanyDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadCompanies} />

        {editCompany && (
          <CompanyDialog
            isOpen={!!editCompany}
            onClose={() => setEditCompany(null)}
            companyId={editCompany.id}
            initialData={{
              name: editCompany.name,
              industry: editCompany.industry || "",
              website: editCompany.website || "",
              description: editCompany.description || "",
            }}
            onSuccess={reloadCompanies}
          />
        )}
      </div>
    </PageContainer>
  )
}
