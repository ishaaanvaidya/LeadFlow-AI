"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createDealSchema, CreateDealInput } from "../schemas/deals.schema"
import { createDealAction, updateDealAction } from "../actions/deals.actions"
import { getPipelineStagesAction } from "../../pipelines/actions/pipelines.actions"
import { getCompaniesAction } from "../../companies/actions/companies.actions"
import { getContactsAction } from "../../contacts/actions/contacts.actions"
import { getLeadsAction } from "../../leads/actions/leads.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { DealStatus } from "@/generated/prisma/enums"

interface DealDialogProps {
  isOpen: boolean
  onClose: () => void
  dealId?: string
  initialData?: Partial<CreateDealInput>
  onSuccess?: () => void
}

export function DealDialog({ isOpen, onClose, dealId, initialData, onSuccess }: DealDialogProps) {
  const [stages, setStages] = React.useState<{ id: string; name: string }[]>([])
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([])
  const [contacts, setContacts] = React.useState<{ id: string; firstName: string; lastName: string }[]>([])
  const [leads, setLeads] = React.useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
      getLeadsAction().then((res) => {
        if (res.success && res.data) setLeads(res.data)
      })
    }
  }, [isOpen])

  const form = useForm<CreateDealInput>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || 0,
      probability: initialData?.probability || 50,
      closeDate: initialData?.closeDate || "",
      status: initialData?.status || DealStatus.OPEN,
      leadId: initialData?.leadId || "",
      companyId: initialData?.companyId || "",
      contactId: initialData?.contactId || "",
      stageId: initialData?.stageId || "",
    },
  })

  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || "",
        value: initialData.value || 0,
        probability: initialData.probability || 50,
        closeDate: initialData.closeDate || "",
        status: initialData.status || DealStatus.OPEN,
        leadId: initialData.leadId || "",
        companyId: initialData.companyId || "",
        contactId: initialData.contactId || "",
        stageId: initialData.stageId || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateDealInput) => {
    setIsSubmitting(true)
    try {
      let result
      if (dealId) {
        result = await updateDealAction(dealId, values)
      } else {
        result = await createDealAction(values)
      }

      if (result.success) {
        toast.success(dealId ? "Deal updated successfully" : "Deal created successfully")
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
          <DialogTitle>{dealId ? "Edit Deal" : "Create Deal"}</DialogTitle>
          <DialogDescription>
            {dealId ? "Update opportunity parameters." : "Add a qualified deal opportunity to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Deal Name *</label>
            <Input
              {...form.register("name")}
              placeholder="e.g. Wayne Systems Expansion"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Deal Value ($) *</label>
              <Input
                type="number"
                placeholder="10000"
                error={form.formState.errors.value?.message}
                {...form.register("value", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Probability (%)</label>
              <Input
                type="number"
                placeholder="50"
                error={form.formState.errors.probability?.message}
                {...form.register("probability", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Expected Close Date</label>
              <Input
                type="date"
                error={form.formState.errors.closeDate?.message}
                {...form.register("closeDate")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Status</label>
              <select
                {...form.register("status")}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {Object.values(DealStatus).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Related Lead</label>
              <select
                {...form.register("leadId")}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="">None</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
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
              {dealId ? "Save Changes" : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
