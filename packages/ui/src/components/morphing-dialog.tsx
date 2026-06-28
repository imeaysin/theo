"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Icons } from "@workspace/ui/components/icons"
import { useClickOutside } from "@workspace/ui/hooks/use-click-outside"
import { useIsClient } from "@workspace/ui/hooks/use-is-client"
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
} from "motion/react"
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

export interface MorphingDialogContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  uniqueId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null)

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext)
  if (!context) {
    throw new Error(
      "useMorphingDialog must be used within a MorphingDialogProvider"
    )
  }
  return context
}

export interface MorphingDialogProviderProps {
  children: React.ReactNode
  transition?: Transition
}

function MorphingDialogProvider({
  children,
  transition,
}: MorphingDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null!)

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
    }),
    [isOpen, uniqueId]
  )

  const defaultTransition: Transition = {
    type: "spring",
    stiffness: 200,
    damping: 24,
  }

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition || defaultTransition}>
        {children}
      </MotionConfig>
    </MorphingDialogContext.Provider>
  )
}

export interface MorphingDialogProps {
  children: React.ReactNode
  transition?: Transition
}

function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const defaultTransition: Transition = {
    type: "spring",
    stiffness: 200,
    damping: 24,
  }

  return (
    <MorphingDialogProvider>
      <MotionConfig transition={transition || defaultTransition}>
        {children}
      </MotionConfig>
    </MorphingDialogProvider>
  )
}

export interface MorphingDialogTriggerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  triggerRef?: React.RefObject<HTMLButtonElement>
}

function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingDialog()

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen]
  )

  // Extract rotation from style.transform if it's a string
  const rotationMatch =
    typeof style?.transform === "string"
      ? style.transform.match(/rotate\(([^)]+)\)/)
      : null
  const rotation = rotationMatch?.[1] || null

  const transformTemplate = useCallback(
    (_transform: string, generatedTransform: string) => {
      // Preserve rotation from style prop if present
      // generatedTransform contains the layout animation transform
      // We need to append our rotation to it
      if (rotation) {
        // Remove any existing rotate from generatedTransform to avoid conflicts
        const cleanedTransform = generatedTransform
          .replace(/rotate\([^)]+\)/g, "")
          .trim()
        return cleanedTransform
          ? `${cleanedTransform} rotate(${rotation})`
          : `rotate(${rotation})`
      }
      return generatedTransform
    },
    [rotation]
  )

  // Remove transform from style since we'll handle it via transformTemplate
  const mergedStyle = useMemo(() => {
    if (!style) return undefined
    if (typeof style.transform === "string" && rotation) {
      const { transform: _, ...restStyle } = style as {
        transform?: string
        [key: string]: unknown
      }
      return restStyle
    }
    return style
  }, [style, rotation])

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={mergedStyle}
      layout
      transformTemplate={rotation ? (transformTemplate as never) : undefined}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
    >
      {children}
    </motion.button>
  )
}

export interface MorphingDialogContentProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog()
  const containerRef = useRef<HTMLDivElement>(null!)
  const [firstFocusableElement, setFirstFocusableElement] =
    useState<HTMLElement | null>(null)
  const [lastFocusableElement, setLastFocusableElement] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
      if (event.key === "Tab") {
        if (!firstFocusableElement || !lastFocusableElement) return

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault()
            lastFocusableElement.focus()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault()
            firstFocusableElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [setIsOpen, firstFocusableElement, lastFocusableElement])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement)
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement
        )
        ;(focusableElements[0] as HTMLElement).focus()
      }
    } else {
      document.body.classList.remove("overflow-hidden")
      triggerRef.current?.focus()
    }
  }, [isOpen, triggerRef])

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative overflow-hidden", className)}
      style={style}
      layout
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

export interface MorphingDialogContainerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, uniqueId } = useMorphingDialog()
  const mounted = useIsClient()

  if (!mounted) return null

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-[9999] bg-white/40 backdrop-blur-sm dark:bg-black/40"
            style={{
              height: "100dvh", // Dynamic viewport height for mobile Safari
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export interface MorphingDialogTitleProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogTitle({
  children,
  className,
  style,
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      {children}
    </motion.div>
  )
}

export interface MorphingDialogSubtitleProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogSubtitle({
  children,
  className,
  style,
}: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
      layout
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      {children}
    </motion.div>
  )
}

export interface MorphingDialogDescriptionProps {
  children: React.ReactNode
  className?: string
  disableLayoutAnimation?: boolean
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

export interface MorphingDialogImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  )
}

export interface MorphingDialogCloseProps {
  children?: React.ReactNode
  className?: string
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function MorphingDialogClose({
  children,
  className,
  variants,
}: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const buttonContent = children || (
    <Icons.Close className="h-6 w-6 text-primary" />
  )

  // Always use a regular button - don't use motion.button to avoid layout animation issues
  // If variants are needed, apply them to a wrapper div
  const button = (
    <button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      className={cn("focus:outline-none", className)}
      style={{
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      {buttonContent}
    </button>
  )

  if (variants) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        layout={false}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        {button}
      </motion.div>
    )
  }

  return button
}

export {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
}
