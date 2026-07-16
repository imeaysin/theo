import { env } from "@workspace/config"

type SocialProviderConfig = {
  readonly clientId: string
  readonly clientSecret: string
}

type SocialProviders = {
  readonly google?: SocialProviderConfig
  readonly github?: SocialProviderConfig
  readonly microsoft?: SocialProviderConfig
  readonly discord?: SocialProviderConfig
}

function optionalProvider(
  clientId: string,
  clientSecret: string
): SocialProviderConfig | undefined {
  if (!clientId || !clientSecret) return undefined
  return { clientId, clientSecret }
}

export function buildSocialProviders(): SocialProviders {
  return {
    google: optionalProvider(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET),
    github: optionalProvider(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET),
    microsoft: optionalProvider(
      env.MICROSOFT_CLIENT_ID,
      env.MICROSOFT_CLIENT_SECRET
    ),
    discord: optionalProvider(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET),
  }
}

export function buildTrustedOrigins(): string[] {
  return env.ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}
