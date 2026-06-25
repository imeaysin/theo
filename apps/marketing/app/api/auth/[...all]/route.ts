import { auth } from "@workspace/auth"
import { toNextJsHandler } from "@workspace/auth/nextjs"

export const { GET, POST } = toNextJsHandler(auth)
