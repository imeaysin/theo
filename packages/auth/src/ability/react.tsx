"use client"

import type { ReactNode } from "react"
import {
  AbilityProvider as CaslAbilityProvider,
  Can,
  useAbility as useCaslAbility,
} from "@casl/react"
import { defineAbilityFor } from "./factory"
import type { AbilityUser, AppAbility } from "./types"

export { Can }

export function useAbility(): AppAbility {
  return useCaslAbility<AppAbility>()
}

type AbilityProviderProps = {
  readonly user: AbilityUser
  readonly children: ReactNode
}

export function AbilityProvider(props: AbilityProviderProps) {
  const ability = defineAbilityFor(props.user)
  return (
    <CaslAbilityProvider value={ability}>{props.children}</CaslAbilityProvider>
  )
}
