import type { RouteObject } from "react-router-dom"
import { routeSegments } from "@/config/routes"

export const aiRoutes: RouteObject[] = [
  {
    path: routeSegments.app.ai,
    async lazy() {
      const { ChatPage } = await import("@/features/ai/pages/chat-page")
      return { Component: ChatPage }
    },
  },
]
