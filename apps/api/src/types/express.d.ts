import type { SessionUser, SessionData } from '@repo/auth';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: SessionData;
    }
  }
}
