import type { RouteObject } from "react-router-dom"
import { paths } from "@/config/paths"

export const homeRoutes: RouteObject[] = [
  {
    path: paths.home,
    lazy: async () => {
      const { HomePage } = await import("./pages/home-page")
      return { Component: HomePage }
    },
  },
]
