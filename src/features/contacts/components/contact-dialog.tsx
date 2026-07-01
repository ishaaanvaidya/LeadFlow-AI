"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createContactSchema, CreateContactInput } from "../schemas/contacts.schema"
import { createContactAction, updateContactAction } from "../actions/contacts.actions"
import { getCompaniesAction } from "../../companies/actions/companies.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface ContactDialogProps {
  isOpen: boolean
  onClose: () => void
  contactId?: string
  initialData?: Partial<CreateContactInput>
  onSuccess?: () => void
}

export function ContactDialog({ isOpen, onClose, contactId, initialData, onSuccess }: ContactDialogProps) {
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      getCompaniesAction().then((res) => {
        if (res.success && res.data) setCompanies(res.data)
      })
    }
  }, [isOpen])

  const form = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      jobTitle: initialData?.jobTitle || "",
      companyId: initialData?.companyId || "",
    },
  })

  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        jobTitle: initialData.jobTitle || "",
        companyId: initialData.companyId || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateContactInput) => {
    setIsSubmitting(true)
    try {
      let result
      if (contactId) {
        result = await updateContactAction(contactId, values)
      } else {
        result = await createContactAction(values)
      }

      if (result.success) {
        toast.success(contactId ? "Contact updated successfully" : "Contact created successfully")
        form.reset()
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50">
        <DialogHeader>
          <DialogTitle>{contactId ? "Edit Contact" : "Create Contact"}</DialogTitle>
          <DialogDescription>
            {contactId ? "Update contact information in your CRM." : "Add a new client contact person to your database."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">First Name *</label>
              <Input
                {...form.register("firstName")}
                placeholder="Pepper"
                error={form.formState.errors.firstName?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Last Name *</label>
              <Input
                {...form.register("lastName")}
                placeholder="Potts"
                error={form.formState.errors.lastName?.message}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email</label>
            <Input
              {...form.register("email")}
              placeholder="pepper@stark.com"
              error={form.formState.errors.email?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Phone</label>
            <Input
              {...form.register("phone")}
              placeholder="555-0199"
              error={form.formState.errors.phone?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Job Title</label>
            <Input
              {...form.register("jobTitle")}
              placeholder="e.g. COO, Executive Assistant"
              error={form.formState.errors.jobTitle?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Company</label>
            <select
              {...form.register("companyId")}
              className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="">None</option>
              {companies.map((co) => (
                <option key={co.id} value={co.id}>
                  {co.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {contactId ? "Save Changes" : "Create Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
