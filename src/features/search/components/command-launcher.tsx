"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandPalette } from "./command-palette"

export function CommandLauncher() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="hidden min-w-52 justify-between gap-3 text-neutral-500 md:inline-flex"
      >
        <span className="inline-flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search CRM
        </span>
        <kbd className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] dark:border-neutral-700">
          Ctrl K
        </kbd>
      </Button>

      {isOpen && <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}
