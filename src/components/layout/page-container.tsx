import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto space-y-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}
