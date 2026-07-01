export function getEmailPrompt(context: {
  leadName: string
  companyName?: string
  contactName?: string
  estimatedValue?: number
  notes?: string[]
  tone?: string
}) {
  const notesText = context.notes && context.notes.length > 0
    ? context.notes.map(n => `- ${n}`).join("\n")
    : "No extra notes available."

  const prompt = `You are a world-class B2B sales development representative (SDR) writing an outreach email.
Write an authentic, highly personalized, non-spammy outreach email tailored to the lead details below.
Focus on solving their pain points. Keep it under 150 words.

Lead Details:
- Lead/Opportunity Name: ${context.leadName}
- Company: ${context.companyName || "Unknown"}
- Contact Person: ${context.contactName || "Unknown"}
- Estimated Value: ${context.estimatedValue ? `$${context.estimatedValue.toLocaleString()}` : "Not specified"}
- Background Notes:
${notesText}

Tone of voice: ${context.tone || "Professional and polite"}

You MUST return your response as a valid JSON object ONLY. Do not include any markdown styling, prefix text, or trailing explanations. The JSON must exactly match this schema:
{
  "subject": "Clear, engaging email subject line",
  "body": "Hi [Name],\\n\\n[Email Body text]\\n\\nBest regards,\\n[Your Name]"
}`

  return [
    { role: "system" as const, content: "You are a professional CRM assistant that writes structured sales drafts in JSON." },
    { role: "user" as const, content: prompt }
  ]
}
