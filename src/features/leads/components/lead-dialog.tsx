"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLeadSchema, CreateLeadInput } from "../schemas/leads.schema"
import { createLeadAction, updateLeadAction } from "../actions/leads.actions"
import { getPipelineStagesAction } from "../../pipelines/actions/pipelines.actions"
import { getCompaniesAction } from "../../companies/actions/companies.actions"
import { getContactsAction } from "../../contacts/actions/contacts.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { LeadSource } from "@/generated/prisma/enums"

interface LeadDialogProps {
  isOpen: boolean
  onClose: () => void
  leadId?: string
  initialData?: Partial<CreateLeadInput>
  onSuccess?: () => void
}

export function LeadDialog({ isOpen, onClose, leadId, initialData, onSuccess }: LeadDialogProps) {
  const [stages, setStages] = React.useState<{ id: string; name: string }[]>([])
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([])
  const [contacts, setContacts] = React.useState<{ id: string; firstName: string; lastName: string }[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Fetch relations
  React.useEffect(() => {
    if (isOpen) {
      getPipelineStagesAction().then((res) => {
        if (res.success && res.data) setStages(res.data)
      })
      getCompaniesAction().then((res) => {
        if (res.success && res.data) setCompanies(res.data)
      })
      getContactsAction().then((res) => {
        if (res.success && res.data) setContacts(res.data)
      })
    }
  }, [isOpen])

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      source: initialData?.source || LeadSource.OTHER,
      estimatedValue: initialData?.estimatedValue || 0,
      companyId: initialData?.companyId || "",
      contactId: initialData?.contactId || "",
      stageId: initialData?.stageId || "",
    },
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        source: initialData.source || LeadSource.OTHER,
        estimatedValue: initialData.estimatedValue || 0,
        companyId: initialData.companyId || "",
        contactId: initialData.contactId || "",
        stageId: initialData.stageId || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateLeadInput) => {
    setIsSubmitting(true)
    try {
      let result
      if (leadId) {
        result = await updateLeadAction(leadId, values)
      } else {
        result = await createLeadAction(values)
      }

      if (result.success) {
        toast.success(leadId ? "Lead updated successfully" : "Lead created successfully")
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
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50">
        <DialogHeader>
          <DialogTitle>{leadId ? "Edit Lead" : "Create Lead"}</DialogTitle>
          <DialogDescription>
            {leadId ? "Update lead details in your sales pipeline." : "Add a new lead to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Lead Name *</label>
            <Input
              {...form.register("name")}
              placeholder="e.g. Acme Corp Expansion"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email</label>
              <Input
                {...form.register("email")}
                placeholder="email@example.com"
                error={form.formState.errors.email?.message}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Phone</label>
              <Input
                {...form.register("phone")}
                placeholder="555-0100"
                error={form.formState.errors.phone?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Est. Value ($)</label>
              <Input
                type="number"
                placeholder="0"
                error={form.formState.errors.estimatedValue?.message}
                {...form.register("estimatedValue", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Lead Source</label>
              <select
                {...form.register("source")}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {Object.values(LeadSource).map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Pipeline Stage *</label>
            <select
              {...form.register("stageId")}
              className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="">Select a stage</option>
              {stages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
            {form.formState.errors.stageId && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.stageId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Contact</label>
              <select
                {...form.register("contactId")}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="">None</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {leadId ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
