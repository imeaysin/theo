import type { Metadata } from "next"
import { LicenseDeactivationPage } from "@/components/pages/license-deactivation-page"

export const metadata: Metadata = {
  title: "Deactivate License — Theo",
  description:
    "Deactivate your Theo commercial license from its current device to use it elsewhere.",
}

export default function App() {
  return <LicenseDeactivationPage />
}
