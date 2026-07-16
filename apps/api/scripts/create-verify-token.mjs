#!/usr/bin/env node
/**
 * Test harness: mint an email-verification JWT (same shape as Better Auth).
 * Usage: node create-verify-token.mjs user@example.com
 *
 * Loads BETTER_AUTH_SECRET via @workspace/config (same as the API).
 */
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { SignJWT } from "jose"

const require = createRequire(import.meta.url)
const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const { env } = await import(
  require.resolve("@workspace/config", { paths: [apiRoot] })
)

const email = process.argv[2]
if (!email) {
  console.error("Usage: create-verify-token.mjs <email>")
  process.exit(1)
}

const token = await new SignJWT({ email: email.toLowerCase() })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
  .sign(new TextEncoder().encode(env.BETTER_AUTH_SECRET))

process.stdout.write(token)
