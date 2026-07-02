import { useOutletContext } from "react-router-dom"

export type AppOutletContext = {
  openCreateOrganization: () => void
}

export function useAppOutletContext() {
  return useOutletContext<AppOutletContext>()
}
