import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    const showClear = onClear && value && String(value).length > 0

    return (
      <div className="relative w-full max-w-sm flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          className={cn("pl-9 pr-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800", className)}
          ref={ref}
          value={value}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"
