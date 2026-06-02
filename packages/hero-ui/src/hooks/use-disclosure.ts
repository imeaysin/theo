"use client"

import { useCallback, useState } from "react"

export interface UseDisclosureReturn {
  /** Whether the disclosure is open */
  isOpen: boolean
  /** Open the disclosure */
  onOpen: () => void
  /** Close the disclosure */
  onClose: () => void
  /** Toggle the disclosure state */
  onToggle: () => void
  /** Programmatically set the open state */
  setOpen: (isOpen: boolean) => void
}

export interface UseDisclosureOptions {
  /** Whether the disclosure is open by default */
  defaultOpen?: boolean
  /** Callback when the disclosure opens */
  onOpen?: () => void
  /** Callback when the disclosure closes */
  onClose?: () => void
}

/**
 * Hook to manage disclosure state (modals, dropdowns, etc.)
 * Common pattern in HeroUI v3 for controlling component visibility
 *
 * @example
 * const { isOpen, onOpen, onClose } = useDisclosure()
 *
 * <Button onPress={onOpen}>Open Modal</Button>
 * <Modal isOpen={isOpen} onClose={onClose}>...</Modal>
 */
export function useDisclosure(
  options: UseDisclosureOptions = {}
): UseDisclosureReturn {
  const {
    defaultOpen = false,
    onOpen: onOpenCallback,
    onClose: onCloseCallback,
  } = options
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => {
    setIsOpen(true)
    onOpenCallback?.()
  }, [onOpenCallback])

  const onClose = useCallback(() => {
    setIsOpen(false)
    onCloseCallback?.()
  }, [onCloseCallback])

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const setOpen = useCallback((value: boolean) => {
    setIsOpen(value)
  }, [])

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setOpen,
  }
}
