import type { Session, User } from "better-auth"

export declare function getServerSession(): Promise<{
  session: Session
  user: User
} | null>
