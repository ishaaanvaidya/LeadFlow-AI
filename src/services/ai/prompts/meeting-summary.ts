export function getMeetingSummaryPrompt(meeting: {
  title: string
  description?: string
  notes?: string
}) {
  const prompt = `You are a sales assistant summarizing a customer meeting.
Compile a concise summary, listing action items and next steps.

Meeting details:
- Title: ${meeting.title}
- Description: ${meeting.description || "No description provided"}
- Notes/Transcript context:
${meeting.notes || "No notes logged yet."}

You MUST return your response as a valid JSON object ONLY. Do not include prefix/suffix texts. The JSON must exactly match this schema:
{
  "summary": "High-level summary paragraph of the meeting.",
  "actionItems": ["Action item 1 for owner", "Action item 2 for owner"],
  "nextSteps": "Single-sentence next milestone target."
}`

  return [
    { role: "system" as const, content: "You are a professional meeting summarizer assistant that outputs JSON summaries." },
    { role: "user" as const, content: prompt }
  ]
}
