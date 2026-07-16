"use client"

import {
  type PasskeyAuthClient,
  useAuth,
  useAuthPlugin,
  useListPasskeys,
} from "@better-auth-ui/react"
import { useState } from "react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import { passkeyPlugin } from "@/lib/auth/passkey-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"

import { AddPasskeyDialog } from "@/features/auth/components/passkey/add-passkey-dialog"
import { Passkey } from "@/features/auth/components/passkey/passkey"
import { PasskeySkeleton } from "@/features/auth/components/passkey/passkey-skeleton"
import { PasskeysEmpty } from "@/features/auth/components/passkey/passkeys-empty"

export type PasskeysProps = {
  className?: string
}

export function Passkeys({ className }: PasskeysProps) {
  const { authClient } = useAuth()
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin)

  const { data: passkeys, isPending } = useListPasskeys(
    authClient as PasskeyAuthClient
  )

  const [addOpen, setAddOpen] = useState(false)

  function renderCardContent() {
    if (isPending) return <PasskeySkeleton />

    if (!passkeys?.length) {
      return <PasskeysEmpty onAddPress={() => setAddOpen(true)} />
    }

    return passkeys.map((passkey, index) => (
      <div key={passkey.id}>
        {index > 0 && <Separator />}

        <Passkey passkey={passkey} />
      </div>
    ))
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="truncate text-sm font-semibold">
          {passkeyLocalization.passkeys}
        </h2>

        <Button
          className="shrink-0"
          size="sm"
          disabled={isPending}
          onClick={() => setAddOpen(true)}
        >
          {passkeyLocalization.addPasskey}
        </Button>
      </div>

      <Card className="p-0">
        <CardContent className="p-0">{renderCardContent()}</CardContent>
      </Card>

      <AddPasskeyDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
