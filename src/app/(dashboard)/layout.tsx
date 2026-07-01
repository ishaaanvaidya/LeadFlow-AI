import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { NavLinks } from "./nav-links";
import { CommandLauncher } from "@/features/search/components/command-launcher";

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
        <NavLinks />
        
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
            <CommandLauncher />
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
