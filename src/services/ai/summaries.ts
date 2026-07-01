import { generateCompletion, AIResponse } from "./provider"
import { getMeetingSummaryPrompt } from "./prompts/meeting-summary"

export interface MeetingSummaryResult {
  summary: string
  actionItems: string[]
  nextSteps: string
}

export async function summarizeMeeting(meeting: {
  title: string
  description?: string
  notes?: string
}): Promise<AIResponse<MeetingSummaryResult>> {
  // 1. Build prompt
  const messages = getMeetingSummaryPrompt(meeting)

  // 2. Query model
  const response = await generateCompletion(messages)

  if (!response.success || !response.data) {
    // Graceful Fallback
    console.warn("Using fallback meeting summary due to AI failure:", response.error)
    return {
      success: true,
      data: {
        summary: `Summary of "${meeting.title}": Meeting held to discuss customer requirements. Notes context logged: ${meeting.notes || "None."}`,
        actionItems: [
          "Follow up with client regarding open items in the notes feed.",
          "Prepare necessary materials for the next scheduled conversation.",
        ],
        nextSteps: "Schedule follow up presentation in the CRM calendar.",
      },
      error: response.error,
    }
  }

  // 3. Parse JSON output
  try {
    const cleanedJson = response.data.trim().replace(/^```json\s*/i, "").replace(/```$/, "")
    const parsed = JSON.parse(cleanedJson) as MeetingSummaryResult
    return {
      success: true,
      data: {
        summary: parsed.summary || "Summary pending.",
        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
        nextSteps: parsed.nextSteps || "Follow up on action items.",
      },
    }
  } catch (err) {
    console.error("Failed to parse AI meeting summary JSON:", err, response.data)
    return {
      success: true,
      data: {
        summary: meeting.description || "Meeting notes review complete.",
        actionItems: ["Review transcript notes manually."],
        nextSteps: "Prepare proposal drafts.",
      },
      error: "AI response format mismatch.",
    }
  }
}
