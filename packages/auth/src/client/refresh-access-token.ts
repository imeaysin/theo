import type { AuthClientWithToken } from "./types"
import type { TokenStorage } from "./token-storage"

export async function refreshAccessToken(
  authClient: AuthClientWithToken,
  tokenStorage: TokenStorage
): Promise<string> {
  const result = await authClient.token()

  if (result.error) throw result.error
  if (!result.data?.token) throw new Error("Failed to refresh access token")

  tokenStorage.setAccessToken(result.data.token)
  return result.data.token
}
