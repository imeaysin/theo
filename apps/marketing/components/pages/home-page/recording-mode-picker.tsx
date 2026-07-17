"use client"

import { cn } from "@workspace/ui-shadcn/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { InstantIcon, ScreenshotIcon, StudioIcon } from "./mode-icons"

type ModeId = "instant" | "studio" | "screenshot"

interface ModeOption {
  id: ModeId
  title: string
  description: string
  icon: (props: { className?: string }) => React.JSX.Element
}

const modes: ModeOption[] = [
  {
    id: "instant",
    title: "Instant",
    description:
      "Share instantly with a link. Your recording uploads as you record, so you can share it immediately when you're done.",
    icon: InstantIcon,
  },
  {
    id: "studio",
    title: "Studio",
    description:
      "Record locally in the highest quality for editing later. Perfect for creating polished content with effects and transitions.",
    icon: StudioIcon,
  },
  {
    id: "screenshot",
    title: "Screenshot",
    description:
      "Capture and annotate screenshots instantly. Great for quick captures, bug reports, and visual communication.",
    icon: ScreenshotIcon,
  },
]

const AUTO_CYCLE_INTERVAL = 3500

const RecordingModePicker = () => {
  const [selected, setSelected] = useState<ModeId>("instant")
  const [userInteracted, setUserInteracted] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback((id: ModeId) => {
    setUserInteracted(true)
    setSelected(id)
  }, [])

  useEffect(() => {
    if (userInteracted || !isInView) return

    const interval = setInterval(() => {
      setSelected((prev) => {
        const currentIndex = modes.findIndex((m) => m.id === prev)
        const nextMode = modes[(currentIndex + 1) % modes.length]
        return nextMode ? nextMode.id : prev
      })
    }, AUTO_CYCLE_INTERVAL)

    return () => clearInterval(interval)
  }, [userInteracted, isInView])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const selectedMode = modes.find((m) => m.id === selected)

  return (
    <section ref={containerRef} className="mx-auto w-full max-w-5xl px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center md:mb-14"
      >
        <span className="mb-3 inline-block text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          3 Modes
        </span>
        <h2 className="mb-3 text-3xl font-medium text-foreground md:text-4xl">
          One app, every workflow
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Whether you need speed, studio quality, or a quick screenshot — Theo
          has a mode for it.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col items-center"
      >
        <div className="relative" role="tablist" aria-label="Recording mode">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 rounded-full border border-border bg-muted md:h-28"
          />
          <div className="relative grid grid-cols-3 gap-4 p-3 md:gap-5 md:p-3.5">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={selected === mode.id}
                aria-label={mode.title}
                onClick={() => handleSelect(mode.id)}
                className="group flex w-18 flex-col items-center gap-3 md:w-22 md:gap-4"
              >
                <span
                  className={cn(
                    "relative flex size-18 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 group-hover:bg-border group-hover:text-foreground md:size-22",
                    selected === mode.id && "bg-border text-foreground"
                  )}
                >
                  {selected === mode.id && (
                    <motion.span
                      layoutId="mode-ring"
                      className="absolute inset-0 rounded-full ring-2 ring-primary ring-offset-3 ring-offset-background"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <mode.icon className="size-7 md:size-8" />
                </span>
                <span
                  className={cn(
                    "text-sm font-medium text-muted-foreground transition-colors",
                    selected === mode.id && "text-foreground"
                  )}
                >
                  {mode.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selectedMode && (
            <motion.div
              key={selectedMode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-7 min-h-14 max-w-lg px-2 text-center md:mt-9"
            >
              <p className="text-base leading-relaxed text-muted-foreground">
                {selectedMode.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default RecordingModePicker
