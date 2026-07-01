import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getMeetings } from "@/features/meetings/data/meetings.data"
import { MeetingsClient } from "@/features/meetings/components/meetings-client"

export const metadata = {
  title: "Meetings | LeadFlow AI",
  description: "Schedule and track your client meetings and sales calls.",
}

export default async function MeetingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const rawMeetings = await getMeetings(session.user.id)

  const meetings = rawMeetings.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    startTime: m.startTime.toISOString(),
    endTime: m.endTime.toISOString(),
    location: m.location,
    lead: m.lead ? { id: m.lead.id, name: m.lead.name } : null,
    contact: m.contact
      ? { id: m.contact.id, firstName: m.contact.firstName, lastName: m.contact.lastName }
      : null,
  }))

  return <MeetingsClient initialMeetings={meetings} />
}
