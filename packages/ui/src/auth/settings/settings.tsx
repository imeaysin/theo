"use client"

import { useAuthenticate, useAuthUiConfig } from "@workspace/auth/react"
import { Shield, User2 } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTab,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"
import type { AccountSettingsProps } from "./account/account-settings"
import { AccountSettings } from "./account/account-settings"
import { SecuritySettings } from "./security/security-settings"

export type SettingsView = "account" | "security"

export interface SettingsProps {
  className?: string
  view: SettingsView
  hideNav?: boolean
  account?: AccountSettingsProps
}

export function Settings({ className, view, hideNav, account }: SettingsProps) {
  const config = useAuthUiConfig()
  useAuthenticate()

  return (
    <Tabs className={cn("w-full gap-4 md:gap-6", className)} value={view}>
      <div className={cn(hideNav && "hidden")}>
        <TabsList aria-label="Settings">
          <TabsTab
            className="gap-1"
            onClick={() => config.navigate(config.routes.settingsAccount)}
            value="account"
          >
            <User2 className="text-muted-foreground" />
            Account
          </TabsTab>

          <TabsTab
            className="gap-1"
            onClick={() => config.navigate(config.routes.settingsSecurity)}
            value="security"
          >
            <Shield className="text-muted-foreground" />
            Security
          </TabsTab>
        </TabsList>
      </div>

      <TabsContent tabIndex={-1} value="account">
        <AccountSettings {...account} />
      </TabsContent>

      <TabsContent tabIndex={-1} value="security">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  )
}
