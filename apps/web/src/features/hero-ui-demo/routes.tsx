import type { RouteObject } from "react-router-dom"

export const heroUIDemoRoutes: RouteObject[] = [
  {
    path: "/hero-ui-demo",
    lazy: async () => {
      const { HeroUIDemoPage } = await import("./pages/hero-ui-demo-page")
      return { Component: HeroUIDemoPage }
    },
  },
]
