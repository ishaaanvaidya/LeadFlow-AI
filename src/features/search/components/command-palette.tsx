"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { globalSearchAction } from "@/features/search/actions/search.actions"
import type { SearchResult } from "@/features/search/data/search.data"
import { Search, Users, Building2, UserCheck, DollarSign, X, Loader2 } from "lucide-react"

const TYPE_ICON = {
  lead: Users,
  company: Building2,
  contact: UserCheck,
  deal: DollarSign,
}

const TYPE_COLOR = {
  lead: "text-blue-500",
  company: "text-sky-500",
  contact: "text-green-500",
  deal: "text-amber-500",
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = React.useRef(0)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setSelected(0)

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    if (!value.trim() || value.length < 2) {
      setIsLoading(false)
      setResults([])
      return
    }

    setIsLoading(true)
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    searchTimerRef.current = setTimeout(async () => {
      const response = await globalSearchAction(value)

      if (requestIdRef.current !== requestId) {
        return
      }

      setIsLoading(false)
      setResults(response.success && response.data ? response.data : [])
    }, 250)
  }

  const openHref = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleSelect = (result: SearchResult) => {
    openHref(result.href)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelected((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelected((current) => Math.max(current - 1, 0))
    } else if (event.key === "Enter" && results[selected]) {
      event.preventDefault()
      handleSelect(results[selected])
    } else if (event.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  const quickLinks = [
    { label: "Leads", href: "/leads", icon: Users },
    { label: "Deals", href: "/deals", icon: DollarSign },
    { label: "Pipeline", href: "/pipeline", icon: Building2 },
    { label: "Tasks", href: "/tasks", icon: UserCheck },
  ]

  const quickActions = [
    { label: "Create lead", href: "/leads?create=1", icon: Users },
    { label: "Create company", href: "/companies?create=1", icon: Building2 },
    { label: "Create contact", href: "/contacts?create=1", icon: UserCheck },
    { label: "Create deal", href: "/deals?create=1", icon: DollarSign },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          {isLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-neutral-400" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
          )}
          <input
            type="text"
            autoFocus
            placeholder="Search leads, companies, deals, contacts..."
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden items-center rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400 dark:border-neutral-700 sm:inline-flex">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {!query && (
            <div className="space-y-3 p-3">
              <CommandGroup title="Quick Links" items={quickLinks} onSelect={openHref} />
              <div className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
                <CommandGroup title="Create" items={quickActions} onSelect={openHref} />
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && query.length >= 2 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-400">
              <Search className="mb-2 h-6 w-6" />
              <p className="text-sm">No results for &quot;{query}&quot;</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = TYPE_ICON[result.type]
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className={[
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                      index === selected
                        ? "bg-neutral-100 dark:bg-neutral-900"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
                    ].join(" ")}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                      <Icon className={`h-3.5 w-3.5 ${TYPE_COLOR[result.type]}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{result.title}</p>
                      <p className="truncate text-xs text-neutral-400">{result.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      {result.type}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span><kbd className="font-mono">up/down</kbd> navigate</span>
            <span><kbd className="font-mono">enter</kbd> open</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
          <span className="text-[10px] text-neutral-400">LeadFlow AI Search</span>
        </div>
      </div>
    </div>
  )
}

function CommandGroup({
  title,
  items,
  onSelect,
}: {
  title: string
  items: Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>
  onSelect: (href: string) => void
}) {
  return (
    <div>
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{title}</p>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.href}
            type="button"
            onClick={() => onSelect(item.href)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            <Icon className="h-4 w-4 text-neutral-400" />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
