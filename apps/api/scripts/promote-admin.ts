/**
 * Promotes a user to platform admin by email.
 * Usage: SKIP_ENV_VALIDATION=true pnpm --filter api exec ts-node --transpile-only scripts/promote-admin.ts user@example.com
 */
import mongoose from "mongoose"
import { env } from "@workspace/config"

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()
  if (!email) {
    console.error("Usage: promote-admin.ts <email>")
    process.exit(1)
  }

  await mongoose.connect(env.MONGODB_URI)

  const result = await mongoose.connection
    .collection("user")
    .updateOne({ email }, { $set: { role: "admin" } })

  if (result.matchedCount === 0) {
    console.error(`No user found with email ${email}`)
    await mongoose.disconnect()
    process.exit(1)
  }

  console.log(`Promoted ${email} to platform admin`)
  await mongoose.disconnect()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
