import type { auth } from "./server";

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
export type SessionData = Session["session"];
