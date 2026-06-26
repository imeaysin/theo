import { getSessionCookie } from "@workspace/auth/nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const session = getSessionCookie(req)
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ["/dashboard/:path*"] }
