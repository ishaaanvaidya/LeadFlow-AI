import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"
import { getCompanies } from "@/features/companies/data/companies.data"
import { CompaniesClient } from "@/features/companies/components/companies-client"

export default async function CompaniesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const companies = await getCompanies(session.user.id)

  return <CompaniesClient initialCompanies={companies} />
}
