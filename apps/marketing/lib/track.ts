export const LogEvents = {
  CTA: {
    name: "cta",
    channel: "web",
  },
} as const

export function track(_event: unknown) {
  // Marketing site analytics hook
}
