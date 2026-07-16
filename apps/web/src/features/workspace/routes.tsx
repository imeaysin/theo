import type { RouteObject } from "react-router-dom"
import { routeSegments } from "@/config/routes"

export const workspaceRoutes: RouteObject[] = [
  {
    path: routeSegments.app.workspace,
    async lazy() {
      const { WorkspacePage } =
        await import("@/features/workspace/pages/workspace-page")
      return { Component: WorkspacePage }
    },
  },
]
