import type { Metadata } from "next"
import { productConfig } from "@workspace/config/public"
import { UpdatesPage } from "@/components/pages/updates-page"

export const metadata: Metadata = {
  title: `Blog — ${productConfig.name}`,
  description: `News and updates from ${productConfig.name}.`,
}

export default function App() {
  return <UpdatesPage />
}
