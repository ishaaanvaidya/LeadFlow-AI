import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"
import { getContacts } from "@/features/contacts/data/contacts.data"
import { ContactsClient } from "@/features/contacts/components/contacts-client"

export default async function ContactsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const contacts = await getContacts(session.user.id)

  return <ContactsClient initialContacts={contacts} />
}
