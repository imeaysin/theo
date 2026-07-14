export type ParsedUserAgent = {
  browserName: string
  osName: string
  isMobile: boolean
}

export function parseUserAgent(userAgent?: string | null): ParsedUserAgent {
  const ua = userAgent ?? ""
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)

  let browserName = "Unknown Browser"
  if (/Edg\//.test(ua)) browserName = "Edge"
  else if (/Chrome\//.test(ua)) browserName = "Chrome"
  else if (/Firefox\//.test(ua)) browserName = "Firefox"
  else if (/Safari\//.test(ua)) browserName = "Safari"

  let osName = ""
  if (/Windows/.test(ua)) osName = "Windows"
  else if (/Mac OS X/.test(ua)) osName = "macOS"
  else if (/Android/.test(ua)) osName = "Android"
  else if (/iPhone|iPad|iPod/.test(ua)) osName = "iOS"
  else if (/Linux/.test(ua)) osName = "Linux"

  return { browserName, osName, isMobile }
}
