"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCompanySchema, CreateCompanyInput } from "../schemas/companies.schema"
import { createCompanyAction, updateCompanyAction } from "../actions/companies.actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface CompanyDialogProps {
  isOpen: boolean
  onClose: () => void
  companyId?: string
  initialData?: Partial<CreateCompanyInput>
  onSuccess?: () => void
}

export function CompanyDialog({ isOpen, onClose, companyId, initialData, onSuccess }: CompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: initialData?.name || "",
      industry: initialData?.industry || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
    },
  })

  React.useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        name: initialData.name || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        description: initialData.description || "",
      })
    }
  }, [isOpen, initialData, form])

  const onSubmit = async (values: CreateCompanyInput) => {
    setIsSubmitting(true)
    try {
      let result
      if (companyId) {
        result = await updateCompanyAction(companyId, values)
      } else {
        result = await createCompanyAction(values)
      }

      if (result.success) {
        toast.success(companyId ? "Company updated successfully" : "Company created successfully")
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
          <DialogTitle>{companyId ? "Edit Company" : "Create Company"}</DialogTitle>
          <DialogDescription>
            {companyId ? "Update company information in your records." : "Add a new company profile to your database."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Company Name *</label>
            <Input
              {...form.register("name")}
              placeholder="e.g. Wayne Enterprises"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Industry</label>
            <Input
              {...form.register("industry")}
              placeholder="e.g. Technology, Manufacturing"
              error={form.formState.errors.industry?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Website</label>
            <Input
              {...form.register("website")}
              placeholder="wayneenterprises.com"
              error={form.formState.errors.website?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Description</label>
            <Input
              {...form.register("description")}
              placeholder="e.g. Multi-national conglomerate specializing in security systems"
              error={form.formState.errors.description?.message}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {companyId ? "Save Changes" : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
