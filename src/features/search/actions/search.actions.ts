"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { searchCrm, type SearchResult } from "../data/search.data"

export async function globalSearchAction(query: string): Promise<{ success: boolean; data?: SearchResult[]; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) throw new Error("Unauthorized")

    if (!query.trim() || query.length < 2) {
      return { success: true, data: [] }
    }

    const userId = session.user.id
    const results = await searchCrm(userId, query)

    return { success: true, data: results }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed"
    return { success: false, error: message }
  }
}
