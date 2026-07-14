/**
 * Seeds sample notes for the first user in the database.
 * Sign up via the web app first, then run: pnpm --filter api seed
 */
import mongoose from "mongoose"
import { env } from "@workspace/config"

async function main() {
  await mongoose.connect(env.MONGODB_URI)

  const user = await mongoose.connection.collection("user").findOne({})
  if (!user || typeof user.id !== "string") {
    console.log("No users found. Sign up at the web app, then re-run seed.")
    await mongoose.disconnect()
    return
  }

  const member = await mongoose.connection
    .collection("member")
    .findOne({ userId: user.id })
  if (!member || typeof member.organizationId !== "string") {
    console.log(
      "No organization membership found. Create a workspace in the web app, then re-run seed."
    )
    await mongoose.disconnect()
    return
  }

  const organizationId = member.organizationId
  const now = new Date()
  const notes = [
    {
      organizationId,
      userId: user.id,
      title: "Welcome to Theo",
      body: "This note was created by `pnpm --filter api seed`.",
      createdAt: now,
      updatedAt: now,
    },
    {
      organizationId,
      userId: user.id,
      title: "Try the API",
      body: "Open Swagger at /docs or use the Notes page in the web app.",
      createdAt: now,
      updatedAt: now,
    },
  ]

  const existing = await mongoose.connection
    .collection("notes")
    .countDocuments({
      organizationId,
      userId: user.id,
    })
  if (existing > 0) {
    console.log(
      `User ${user.email} already has ${existing} note(s) in this workspace. Skipping seed.`
    )
    await mongoose.disconnect()
    return
  }

  await mongoose.connection.collection("notes").insertMany(notes)
  console.log(`Seeded ${notes.length} notes for ${user.email}`)
  await mongoose.disconnect()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
