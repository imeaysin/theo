import { createHmac, timingSafeEqual } from "node:crypto"

export const DEFAULT_LOCAL_SIGNED_URL_EXPIRES_SECONDS = 60 * 60

export function normalizeStoragePath(path: string): string {
  return path.replace(/^\/+/, "")
}

export function signLocalDownloadPath(
  path: string,
  signingSecret: string,
  expiresInSeconds: number = DEFAULT_LOCAL_SIGNED_URL_EXPIRES_SECONDS
): { exp: number; sig: string } {
  if (!signingSecret) {
    throw new Error("signingSecret is required for local signed download URLs")
  }

  const normalized = normalizeStoragePath(path)
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const sig = createHmac("sha256", signingSecret)
    .update(`${normalized}.${exp}`)
    .digest("hex")

  return { exp, sig }
}

export function verifyLocalDownloadSignature(input: {
  path: string
  exp: string
  sig: string
  signingSecret: string
  nowSeconds?: number
}): boolean {
  const { path, exp, sig, signingSecret } = input
  if (!signingSecret || !exp || !sig) return false

  const expSeconds = Number(exp)
  if (!Number.isFinite(expSeconds)) return false

  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000)
  if (expSeconds < now) return false

  const expected = createHmac("sha256", signingSecret)
    .update(`${normalizeStoragePath(path)}.${expSeconds}`)
    .digest("hex")

  try {
    const expectedBuf = Buffer.from(expected, "utf8")
    const actualBuf = Buffer.from(sig, "utf8")
    if (expectedBuf.length !== actualBuf.length) return false
    return timingSafeEqual(expectedBuf, actualBuf)
  } catch {
    return false
  }
}

export function buildLocalSignedDownloadUrl(
  baseUrl: string,
  path: string,
  signingSecret: string,
  expiresInSeconds?: number
): string {
  const normalized = normalizeStoragePath(path)
  const { exp, sig } = signLocalDownloadPath(
    normalized,
    signingSecret,
    expiresInSeconds
  )
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  const url = new URL(normalized, base)
  url.searchParams.set("exp", String(exp))
  url.searchParams.set("sig", sig)
  return url.toString()
}
