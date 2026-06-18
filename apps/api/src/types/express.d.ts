import type { AuthenticatedUser } from '@workspace/auth/server';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
