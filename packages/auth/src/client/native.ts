import { createAuthClient } from "better-auth/client"
import { expoClient } from "@better-auth/expo/client"
import { organizationClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"
import {
  getClientPublicEnvSource,
  parseClientPublicEnv,
} from "@workspace/config/client"
import {
  ac,
  adminRole,
  memberRole,
  ownerRole,
  viewerRole,
  NATIVE_APP_SCHEME,
  NATIVE_STORAGE_PREFIX,
} from "../access"

const clientEnv = parseClientPublicEnv(getClientPublicEnvSource())

export type NativeAuthStorage = {
  readonly setItem: (key: string, value: string) => unknown
  readonly getItem: (key: string) => string | null
}

type CreateNativeAuthClientOptions = {
  readonly storage: NativeAuthStorage
}

export function createNativeAuthClient(options: CreateNativeAuthClientOptions) {
  return createAuthClient({
    baseURL: clientEnv.authUrl,
    plugins: [
      expoClient({
        scheme: NATIVE_APP_SCHEME,
        storagePrefix: NATIVE_STORAGE_PREFIX,
        storage: options.storage,
      }),
      organizationClient({
        ac,
        roles: {
          owner: ownerRole,
          admin: adminRole,
          member: memberRole,
          viewer: viewerRole,
        },
        dynamicAccessControl: { enabled: true },
      }),
      adminClient({
        ac,
        roles: {
          admin: adminRole,
          user: memberRole,
        },
      }),
    ],
  })
}

export type NativeAuthClient = ReturnType<typeof createNativeAuthClient>
