import type { IncomingHttpHeaders } from "node:http"

/**
 * Converts Node.js IncomingHttpHeaders to Web Standard Headers.
 * This is useful for passing headers from NestJS/Next.js (Node) to
 * libraries that expect Web Headers (like better-auth).
 */
export function nodeHeadersToWebHeaders(
  nodeHeaders: IncomingHttpHeaders
): Headers {
  const headers = new Headers()
  for (const [key, val] of Object.entries(nodeHeaders)) {
    if (val) {
      if (Array.isArray(val)) {
        val.forEach((v) => headers.append(key, v))
      } else {
        headers.set(key, val)
      }
    }
  }
  return headers
}
