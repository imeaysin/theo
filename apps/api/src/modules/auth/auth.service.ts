import { Injectable } from '@nestjs/common';
import { auth, getSessionFromHeaders } from '@repo/auth/server';
import type { Session, SessionData } from '@repo/auth/server';
import type { IncomingHttpHeaders } from 'http';
import { nodeHeadersToWebHeaders } from '@repo/utils';

/**
 * Injectable wrapper around better-auth API methods.
 * Provides session management operations for controllers and other services.
 */
@Injectable()
export class AuthService {
  /**
   * @description Validate and retrieve the session from incoming request headers.
   * @param headers - The incoming request headers.
   * @returns The session data.
   */
  async getSession(headers: IncomingHttpHeaders): Promise<Session | null> {
    return getSessionFromHeaders(headers);
  }

  /**
   * @description Revoke a specific session by its token.
   * @param token - The session token to revoke.
   * @param headers - The incoming request headers.
   * @returns The session data.
   */
  async revokeSession(
    token: string,
    headers: IncomingHttpHeaders,
  ): Promise<void> {
    const reqHeaders = nodeHeadersToWebHeaders(headers);
    await auth.api.revokeSession({
      headers: reqHeaders,
      body: { token },
    });
  }

  /**
   * @description Revoke all sessions for the current user.
   * @param headers - The incoming request headers.
   * @returns The session data.
   */
  async revokeAllUserSessions(headers: IncomingHttpHeaders): Promise<void> {
    const reqHeaders = nodeHeadersToWebHeaders(headers);
    await auth.api.revokeSessions({ headers: reqHeaders });
  }

  /**
   * @description List all active sessions for the current user.
   * @param headers - The incoming request headers.
   * @returns The session data.
   */
  async listUserSessions(headers: IncomingHttpHeaders): Promise<SessionData[]> {
    const reqHeaders = nodeHeadersToWebHeaders(headers);
    return auth.api.listSessions({ headers: reqHeaders });
  }
}
