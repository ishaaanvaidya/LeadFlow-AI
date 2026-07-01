"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/data-table"
import { SearchInput } from "@/components/common/search-input"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DealDialog } from "./deal-dialog"
import { deleteDealAction } from "../actions/deals.actions"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"
import { DealStatus } from "@/generated/prisma/enums"

interface DealItem {
  id: string
  name: string
  value: number
  probability: number
  closeDate: string | null
  status: DealStatus
  stage: { id: string; name: string }
  company: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
  leadId: string | null
}

interface DealsClientProps {
  initialDeals: DealItem[]
}

export function DealsClient({ initialDeals }: DealsClientProps) {
  const searchParams = useSearchParams()
  const [deals, setDeals] = React.useState<DealItem[]>(initialDeals)
  const [search, setSearch] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editDeal, setEditDeal] = React.useState<DealItem | null>(null)

  const reloadDeals = React.useCallback(() => {
    window.location.reload()
  }, [])

  const filteredDeals = React.useMemo(() => {
    if (!search) return deals
    const s = search.toLowerCase()
    return deals.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        (d.company?.name || "").toLowerCase().includes(s) ||
        (d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : "").toLowerCase().includes(s)
    )
  }, [deals, search])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      const res = await deleteDealAction(id)
      if (res.success) {
        toast.success("Deal deleted successfully")
        setDeals((prev) => prev.filter((d) => d.id !== id))
      } else {
        toast.error(res.error || "Failed to delete deal")
      }
    }
  }

  const columns = [
    {
      header: "Deal Name",
      accessorKey: "name",
      cell: (item: DealItem) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</span>
      ),
    },
    {
      header: "Value",
      accessorKey: "value",
      cell: (item: DealItem) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.value),
    },
    {
      header: "Stage",
      accessorKey: "stage.name",
      cell: (item: DealItem) => (
        <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          {item.stage.name}
        </Badge>
      ),
    },
    {
      header: "Probability",
      accessorKey: "probability",
      cell: (item: DealItem) => <span>{item.probability}%</span>,
    },
    {
      header: "Close Date",
      accessorKey: "closeDate",
      cell: (item: DealItem) =>
        item.closeDate ? new Date(item.closeDate).toLocaleDateString() : <span className="text-neutral-400">-</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: DealItem) => {
        const status = item.status
        let colorClass = ""
        if (status === DealStatus.WON) {
          colorClass = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50"
        } else if (status === DealStatus.LOST) {
          colorClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
        } else {
          colorClass = "bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
        }
        return (
          <Badge variant="outline" className={colorClass}>
            {status}
          </Badge>
        )
      },
    },
    {
      header: "Company",
      accessorKey: "company.name",
      cell: (item: DealItem) => item.company?.name || <span className="text-neutral-400">-</span>,
    },
    {
      header: "",
      accessorKey: "actions",
      className: "text-right w-[80px]",
      cell: (item: DealItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 focus:outline-none cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <DropdownMenuItem
              onClick={() => setEditDeal(item)}
              className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Delete Deal
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
          title="Deals"
          description="Manage commercial sales pipelines and qualified customer contracts."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Deal
            </Button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search deals by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredDeals}
          emptyTitle="No deals found"
          emptyDescription="Log a new sales contract opportunity to track revenue targets."
        />

        <DealDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadDeals} />

        {editDeal && (
          <DealDialog
            isOpen={!!editDeal}
            onClose={() => setEditDeal(null)}
            dealId={editDeal.id}
            initialData={{
              name: editDeal.name,
              value: editDeal.value,
              probability: editDeal.probability,
              closeDate: editDeal.closeDate || "",
              status: editDeal.status,
              leadId: editDeal.leadId || "",
              companyId: editDeal.company?.id || "",
              contactId: editDeal.contact?.id || "",
              stageId: editDeal.stage.id,
            }}
            onSuccess={reloadDeals}
          />
        )}
      </div>
    </PageContainer>
  )
}
