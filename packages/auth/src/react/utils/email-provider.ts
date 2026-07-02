export type EmailProviderLink = {
  loginUrl: string
  providerName: string
}

const PROVIDERS: {
  domains: string[]
  loginUrl: string
  providerName: string
}[] = [
  {
    domains: ["gmail.com", "googlemail.com"],
    loginUrl: "https://mail.google.com",
    providerName: "Gmail",
  },
  {
    domains: ["outlook.com", "hotmail.com", "live.com"],
    loginUrl: "https://outlook.live.com",
    providerName: "Outlook",
  },
  {
    domains: ["yahoo.com"],
    loginUrl: "https://mail.yahoo.com",
    providerName: "Yahoo Mail",
  },
  {
    domains: ["icloud.com", "me.com", "mac.com"],
    loginUrl: "https://www.icloud.com/mail",
    providerName: "iCloud Mail",
  },
  {
    domains: ["proton.me", "protonmail.com"],
    loginUrl: "https://mail.proton.me",
    providerName: "Proton Mail",
  },
]

export function getEmailProviderLink(email: string): EmailProviderLink | null {
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain) return null

  const match = PROVIDERS.find((provider) => provider.domains.includes(domain))
  if (!match) return null

  return {
    loginUrl: match.loginUrl,
    providerName: match.providerName,
  }
}
