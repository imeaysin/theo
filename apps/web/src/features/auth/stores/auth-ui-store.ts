import { create } from "zustand"

type AuthUiState = {
  twoFactorMethods: string[]
  setTwoFactorMethods: (methods: string[]) => void
  clearTwoFactorMethods: () => void
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
  twoFactorMethods: [],
  setTwoFactorMethods: (twoFactorMethods) => set({ twoFactorMethods }),
  clearTwoFactorMethods: () => set({ twoFactorMethods: [] }),
}))
