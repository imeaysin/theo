import type { RouteObject } from "react-router-dom"
import { NotesPage } from "@/features/notes/pages/notes-page"
import { routeSegments } from "@/config/routes"

export const notesRoutes: RouteObject[] = [
  { path: routeSegments.app.notes, element: <NotesPage /> },
]
