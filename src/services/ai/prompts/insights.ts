export function getInsightsPrompt(pipelineData: {
  totalLeads: number
  totalDeals: number
  pipelineValue: number
  winRate: number
  deals: Array<{
    name: string
    value: number
    status: string
    stageName: string
    companyName?: string
  }>
}) {
  const dealsSummary = pipelineData.deals.map(
    (d) => `- ${d.name} (${d.companyName || "No Company"}): $${d.value.toLocaleString()} [Stage: ${d.stageName}, Status: ${d.status}]`
  ).join("\n")

  const prompt = `You are a Chief Revenue Officer (CRO) dashboard assistant providing executive insights on a sales pipeline.
Analyze the following pipeline metrics and suggest optimization tactics, highlighting key wins and risk areas.

Pipeline Overview:
- Active Leads: ${pipelineData.totalLeads}
- Active Opportunities: ${pipelineData.totalDeals}
- Open Pipeline Value: $${pipelineData.pipelineValue.toLocaleString()}
- Historical Win Rate: ${pipelineData.winRate}%

Deal Records:
${dealsSummary}

You MUST return your response as a valid JSON object ONLY. Do not include markdown formatting or warnings. The JSON must exactly match this schema:
{
  "summary": "Executive summary of the pipeline state.",
  "recommendations": ["actionable advice 1", "actionable advice 2"],
  "risks": ["risk warning 1", "risk warning 2"]
}`

  return [
    { role: "system" as const, content: "You are a senior executive sales intelligence service that outputs analytics reports in JSON." },
    { role: "user" as const, content: prompt }
  ]
}
