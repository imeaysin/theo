import type { RouteObject } from "react-router-dom"
import { AppLayout } from "@/components/layouts/app-layout"
import { paths } from "@/config/paths"

export const homeRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        path: paths.home,
        lazy: async () => {
          const { HomePage } = await import("./pages/home-page")
          return { Component: HomePage }
        },
      },
    ],
  },
]
