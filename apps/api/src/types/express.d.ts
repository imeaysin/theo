import type { SessionUser, SessionData } from '@repo/auth/server';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: SessionData;
    }
  }
}
