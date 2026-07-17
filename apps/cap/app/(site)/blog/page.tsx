import type { Metadata } from "next"
import { UpdatesPage } from "@/components/pages/updates-page"

export const metadata: Metadata = {
  title: "Blog — Cap",
}

export default function App() {
  return <UpdatesPage />
}
