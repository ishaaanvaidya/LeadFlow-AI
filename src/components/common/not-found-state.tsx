import * as React from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

interface NotFoundStateProps {
  title?: string
  description?: string
  backLink?: string
  backLabel?: string
}

export function NotFoundState({
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
  backLink = "/",
  backLabel = "Back to Dashboard",
}: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 py-16">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 mb-4">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mb-6">
        {description}
      </p>
      <Link href={backLink} className={buttonVariants({ size: "sm" })}>
        {backLabel}
      </Link>
    </div>
  )
}
