import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "@/components/common/theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Query server-side session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
      {/* Sidebar Placeholder */}
      <aside className="hidden md:flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Workspace
          </div>
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          >
            Dashboard
          </Link>
          
          <div className="pt-4 px-3 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            CRM (Coming Soon)
          </div>
          <div className="px-3 py-2 text-sm text-neutral-400 dark:text-neutral-500 cursor-not-allowed">
            Leads
          </div>
          <div className="px-3 py-2 text-sm text-neutral-400 dark:text-neutral-500 cursor-not-allowed">
            Deals
          </div>
          <div className="px-3 py-2 text-sm text-neutral-400 dark:text-neutral-500 cursor-not-allowed">
            Analytics
          </div>
        </nav>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex flex-col truncate max-w-[150px]">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {session.user.name || "User"}
            </span>
            <span className="text-xs text-neutral-500 truncate">
              {session.user.email}
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Placeholder */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              LeadFlow AI Workspace
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="md:hidden">
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
