import OpenAI from "openai"
import { env } from "@/lib/env"

export interface AIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

let clientInstance: OpenAI | null = null

function getClient(): OpenAI {
  if (!env.NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not configured")
  }

  if (!clientInstance) {
    clientInstance = new OpenAI({
      apiKey: env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    })
  }

  return clientInstance
}

export async function generateCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  model: string = "deepseek-ai/deepseek-v4-pro",
  temperature: number = 0.7
): Promise<AIResponse<string>> {
  try {
    const openai = getClient()
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: 2048,
    })

    const text = completion.choices[0]?.message?.content || ""
    return { success: true, data: text }
  } catch (error) {
    console.error("NVIDIA NIM request failed:", error)
    return {
      success: false,
      error: "AI service is temporarily unavailable.",
    }
  }
}
