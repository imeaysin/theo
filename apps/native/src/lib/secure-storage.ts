import * as SecureStore from "expo-secure-store"

function normalizeKey(key: string): string {
  return key.replace(/:/g, "_")
}

export function createSyncSecureStore(initialKeys: readonly string[] = []) {
  const memory = new Map<string, string>()

  return {
    getItem(key: string): string | null {
      return memory.get(key) ?? null
    },
    setItem(key: string, value: string): void {
      memory.set(key, value)
      void SecureStore.setItemAsync(normalizeKey(key), value)
    },
    deleteItemAsync(key: string): Promise<void> {
      memory.delete(key)
      return SecureStore.deleteItemAsync(normalizeKey(key))
    },
    async hydrate(): Promise<void> {
      await Promise.all(
        initialKeys.map(async (key) => {
          const value = await SecureStore.getItemAsync(normalizeKey(key))
          if (value !== null) {
            memory.set(key, value)
          }
        }),
      )
    },
  }
}
