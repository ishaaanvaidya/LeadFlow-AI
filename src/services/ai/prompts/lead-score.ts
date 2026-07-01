export function getLeadScorePrompt(context: {
  leadName: string
  companyName?: string
  contactName?: string
  estimatedValue?: number
  source?: string
  stageName?: string
  notes?: string[]
  activities?: string[]
}) {
  const notesText = context.notes && context.notes.length > 0
    ? context.notes.map(n => `- ${n}`).join("\n")
    : "No background notes."

  const activitiesText = context.activities && context.activities.length > 0
    ? context.activities.map(a => `- ${a}`).join("\n")
    : "No activity history logged yet."

  const prompt = `You are an expert sales analyst assistant scoring a CRM lead's likelihood of closing.
Review the following lead context and determine whether they are HOT, WARM, or COLD.
Provide a clear, brief explanation detailing your positive and negative scoring signals.

Lead Details:
- Name: ${context.leadName}
- Company: ${context.companyName || "Unknown"}
- Contact Person: ${context.contactName || "Unknown"}
- Estimated Value: ${context.estimatedValue ? `$${context.estimatedValue.toLocaleString()}` : "Not specified"}
- Source Channel: ${context.source || "Unknown"}
- Current Stage: ${context.stageName || "Unknown"}

Timeline Notes:
${notesText}

Activity Logs:
${activitiesText}

You MUST return your response as a valid JSON object ONLY. Do not include markdown wraps or trailing text. The JSON must exactly match this schema:
{
  "score": "HOT" or "WARM" or "COLD",
  "explanation": "Brief explanation summary of why you chose this score.",
  "confidence": 0.85,
  "signals": {
    "positive": ["signal 1", "signal 2"],
    "negative": ["signal 1"]
  }
}`

  return [
    { role: "system" as const, content: "You are a professional sales scoring assistant that analyzes lead datasets and outputs JSON assessments." },
    { role: "user" as const, content: prompt }
  ]
}
