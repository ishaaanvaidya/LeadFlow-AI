import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Welcome, {session.user.name || "User"}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Here is your sales pipeline overview. CRM functionality is currently coming soon.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <CardHeader className="p-0 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Leads
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              0
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-neutral-550">Active leads in pipeline</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Pipeline Value
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              $0.00
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-neutral-550">Estimated value of open deals</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Win Rate
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              0%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-neutral-550">Percentage of won opportunities</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
