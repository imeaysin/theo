import { createAuthMiddleware } from "better-auth/api"
import type { UserWithRole } from "better-auth/plugins/admin"
import { env } from "@workspace/config"

export const autoAdminHook = createAuthMiddleware(async (ctx) => {
  if (ctx.path !== "/sign-up/email" && ctx.path !== "/sign-in/email") return
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return

  const email = env.ADMIN_EMAIL.toLowerCase()

  const result = await ctx.context.internalAdapter.findUserByEmail(email)
  if (!result) {
    ctx.context.logger.info("autoAdminHook: user not found after sign-up", {
      email,
    })
    return
  }

  const user = result.user as UserWithRole
  if (user.email.toLowerCase() !== email) return

  const isAlreadyAdmin = user.role?.split(",").includes("admin")
  if (isAlreadyAdmin) return

  await ctx.context.internalAdapter.updateUser(user.id, {
    role: "admin",
  })

  ctx.context.logger.info("autoAdminHook: user promoted to admin", {
    email,
    userId: user.id,
  })
})
