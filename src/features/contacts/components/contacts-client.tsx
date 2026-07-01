"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/data-table"
import { SearchInput } from "@/components/common/search-input"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContactDialog } from "./contact-dialog"
import { deleteContactAction } from "../actions/contacts.actions"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Mail, Phone } from "lucide-react"

interface ContactItem {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  jobTitle: string | null
  company: { id: string; name: string } | null
  leads: { id: string }[]
}

interface ContactsClientProps {
  initialContacts: ContactItem[]
}

export function ContactsClient({ initialContacts }: ContactsClientProps) {
  const searchParams = useSearchParams()
  const [contacts, setContacts] = React.useState<ContactItem[]>(initialContacts)
  const [search, setSearch] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(searchParams.get("create") === "1")
  const [editContact, setEditContact] = React.useState<ContactItem | null>(null)

  const reloadContacts = React.useCallback(() => {
    window.location.reload()
  }, [])

  const filteredContacts = React.useMemo(() => {
    if (!search) return contacts
    const s = search.toLowerCase()
    return contacts.filter(
      (c) =>
        c.firstName.toLowerCase().includes(s) ||
        c.lastName.toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.company?.name || "").toLowerCase().includes(s)
    )
  }, [contacts, search])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact? Related leads will remain but contact info will be unlinked.")) {
      const res = await deleteContactAction(id)
      if (res.success) {
        toast.success("Contact deleted successfully")
        setContacts((prev) => prev.filter((c) => c.id !== id))
      } else {
        toast.error(res.error || "Failed to delete contact")
      }
    }
  }

  const columns = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (item: ContactItem) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {item.firstName} {item.lastName}
        </span>
      ),
    },
    {
      header: "Job Title",
      accessorKey: "jobTitle",
      cell: (item: ContactItem) => item.jobTitle || <span className="text-neutral-400">-</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (item: ContactItem) =>
        item.email ? (
          <span className="inline-flex items-center gap-1">
            <Mail className="h-3 w-3 text-neutral-400" /> {item.email}
          </span>
        ) : (
          <span className="text-neutral-400">-</span>
        ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (item: ContactItem) =>
        item.phone ? (
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3 text-neutral-400" /> {item.phone}
          </span>
        ) : (
          <span className="text-neutral-400">-</span>
        ),
    },
    {
      header: "Company",
      accessorKey: "company.name",
      cell: (item: ContactItem) => item.company?.name || <span className="text-neutral-400">-</span>,
    },
    {
      header: "Active Leads",
      accessorKey: "leads.length",
      cell: (item: ContactItem) => (
        <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {item.leads.length} active
        </Badge>
      ),
    },
    {
      header: "",
      accessorKey: "actions",
      className: "text-right w-[80px]",
      cell: (item: ContactItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 focus:outline-none cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <DropdownMenuItem
              onClick={() => setEditContact(item)}
              className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Delete Contact
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
          title="Contacts"
          description="Track key stakeholder profiles and relationships across target accounts."
          actions={
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Contact
            </Button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search contacts by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredContacts}
          emptyTitle="No contacts found"
          emptyDescription="Add contacts to map people inside accounts."
        />

        <ContactDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={reloadContacts} />

        {editContact && (
          <ContactDialog
            isOpen={!!editContact}
            onClose={() => setEditContact(null)}
            contactId={editContact.id}
            initialData={{
              firstName: editContact.firstName,
              lastName: editContact.lastName,
              email: editContact.email || "",
              phone: editContact.phone || "",
              jobTitle: editContact.jobTitle || "",
              companyId: editContact.company?.id || "",
            }}
            onSuccess={reloadContacts}
          />
        )}
      </div>
    </PageContainer>
  )
}
