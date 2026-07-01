import * as React from "react"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
    direction: "up" | "down" | "neutral"
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          {value}
        </div>
        {(trend || description) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  "flex items-center font-medium gap-0.5",
                  trend.direction === "up" && "text-green-600 dark:text-green-400",
                  trend.direction === "down" && "text-red-600 dark:text-red-400",
                  trend.direction === "neutral" && "text-neutral-500"
                )}
              >
                {trend.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
                {trend.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-neutral-500 dark:text-neutral-400">
                {trend ? `${trend.label || ""} ${description}` : description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
