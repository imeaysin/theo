export interface TokenStorage {
  getBearerToken(): string | null
  setBearerToken(token: string): void
  clearBearerToken(): void
  getAccessToken(): string | null
  setAccessToken(token: string): void
  clearAccessToken(): void
  clearAll(): void
}

export function createMemoryTokenStorage(
  initial: Partial<{
    bearer: string
    access: string
  }> = {}
): TokenStorage {
  let bearer = initial.bearer ?? null
  let access = initial.access ?? null

  return {
    getBearerToken: () => bearer,
    setBearerToken: (token) => {
      bearer = token
    },
    clearBearerToken: () => {
      bearer = null
    },
    getAccessToken: () => access,
    setAccessToken: (token) => {
      access = token
    },
    clearAccessToken: () => {
      access = null
    },
    clearAll: () => {
      bearer = null
      access = null
    },
  }
}

const BEARER_KEY = "theo.auth.bearer"
const ACCESS_KEY = "theo.auth.access"

export function createWebTokenStorage(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> = globalThis.localStorage
): TokenStorage {
  return {
    getBearerToken: () => storage.getItem(BEARER_KEY),
    setBearerToken: (token) => storage.setItem(BEARER_KEY, token),
    clearBearerToken: () => storage.removeItem(BEARER_KEY),
    getAccessToken: () => storage.getItem(ACCESS_KEY),
    setAccessToken: (token) => storage.setItem(ACCESS_KEY, token),
    clearAccessToken: () => storage.removeItem(ACCESS_KEY),
    clearAll: () => {
      storage.removeItem(BEARER_KEY)
      storage.removeItem(ACCESS_KEY)
    },
  }
}

export function createSecureStoreTokenStorage(store: {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => unknown
  deleteItemAsync?: (key: string) => Promise<void>
}): TokenStorage {
  const remove = (key: string) => {
    if (store.deleteItemAsync) {
      void store.deleteItemAsync(key)
      return
    }
    store.setItem(key, "")
  }

  return {
    getBearerToken: () => store.getItem(BEARER_KEY),
    setBearerToken: (token) => {
      store.setItem(BEARER_KEY, token)
    },
    clearBearerToken: () => remove(BEARER_KEY),
    getAccessToken: () => store.getItem(ACCESS_KEY),
    setAccessToken: (token) => {
      store.setItem(ACCESS_KEY, token)
    },
    clearAccessToken: () => remove(ACCESS_KEY),
    clearAll: () => {
      remove(BEARER_KEY)
      remove(ACCESS_KEY)
    },
  }
}

export function getAuthorizationHeader(
  tokenStorage: TokenStorage,
  prefer: "access" | "bearer" = "access"
): Record<string, string> {
  const access = tokenStorage.getAccessToken()
  const bearer = tokenStorage.getBearerToken()
  const token =
    prefer === "access" ? (access ?? bearer) : (bearer ?? access)

  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
