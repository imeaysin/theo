import { viewPaths } from "@better-auth-ui/core"
import { Navigate, useParams } from "react-router-dom"
import { Settings } from "@/features/auth/components/settings/settings"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

const validSettingsPaths = new Set([
  ...Object.values(viewPaths.settings),
  ...Object.values(organizationPlugin().viewPaths.settings ?? {}),
])

export function SettingsPage() {
  const { view: path } = useParams<{ view?: string }>()

  if (!path) {
    return <Navigate replace to="account" />
  }

  if (!validSettingsPaths.has(path)) {
    return <Navigate replace to="account" />
  }

  return <Settings path={path} />
}
