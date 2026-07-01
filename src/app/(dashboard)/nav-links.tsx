"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  DollarSign,
  KanbanSquare,
  CheckSquare,
  Calendar,
  FileText,
  Activity,
} from "lucide-react"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/contacts", label: "Contacts", icon: UserCheck },
  { href: "/deals", label: "Deals", icon: DollarSign },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/meetings", label: "Meetings", icon: Calendar },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/activities", label: "Activity Feed", icon: Activity },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      <div className="px-3 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        Workspace
      </div>
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
