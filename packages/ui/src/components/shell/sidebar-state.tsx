"use client"

import type React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"

const SIDEBAR_STORAGE_KEY = "shell_sidebar_collapsed"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

function readCollapsedPreference(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

interface SidebarStateValue {
  collapsed: boolean
  isIconSidebar: boolean
  isTabletIconOnly: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarStateContext = createContext<SidebarStateValue | null>(null)

export function useSidebarState(): SidebarStateValue {
  const ctx = useContext(SidebarStateContext)
  if (!ctx) {
    throw new Error("useSidebarState must be used within <AppShell>")
  }
  return ctx
}

export function SidebarStateProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const isTabletIconOnly = useMediaQuery({ min: 768, max: 1024 })
  const [collapsed, setCollapsedState] = useState(readCollapsedPreference)

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value))
    } catch {
      // ignore storage failures
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    if (isTabletIconOnly) return
    setCollapsed(!collapsed)
  }, [collapsed, isTabletIconOnly, setCollapsed])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTabletIconOnly) return
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isTabletIconOnly, toggleSidebar])

  const isIconSidebar = isTabletIconOnly || collapsed

  const value = useMemo<SidebarStateValue>(
    () => ({
      collapsed,
      isIconSidebar,
      isTabletIconOnly,
      setCollapsed,
      toggleSidebar,
    }),
    [collapsed, isIconSidebar, isTabletIconOnly, setCollapsed, toggleSidebar]
  )

  return (
    <SidebarStateContext.Provider value={value}>
      {children}
    </SidebarStateContext.Provider>
  )
}
