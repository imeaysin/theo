import type { SessionUser, SessionData } from '@workspace/auth/server';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: SessionData;
    }
  }
}
