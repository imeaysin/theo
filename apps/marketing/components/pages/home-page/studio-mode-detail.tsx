"use client"

import { Button } from "@/components/product-ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  Camera,
  Check,
  Clapperboard,
  Image as ImageIcon,
  Layers,
  Maximize2,
  MessageSquare,
  MousePointer2,
  MousePointerClick,
  Palette,
  Pause,
  Play,
  Square,
  Volume2,
  Wind,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import UpgradeToPro from "@/components/upgrade-to-pro"

const GRADIENTS = [
  "linear-gradient(135deg, var(--primary), var(--accent))",
  "linear-gradient(135deg, var(--accent), var(--destructive))",
  "linear-gradient(135deg, var(--primary), var(--secondary))",
  "linear-gradient(135deg, var(--secondary), var(--accent))",
  "linear-gradient(135deg, var(--destructive), var(--accent))",
  "linear-gradient(135deg, var(--muted-foreground), var(--accent))",
]

const GRADIENT_COLORS: [string, string][] = [
  ["var(--primary)", "var(--accent)"],
  ["var(--accent)", "var(--destructive)"],
  ["var(--primary)", "var(--secondary)"],
  ["var(--secondary)", "var(--accent)"],
  ["var(--destructive)", "var(--accent)"],
  ["var(--muted-foreground)", "var(--accent)"],
]

interface AutoConfig {
  gradientIndex: number
  padding: number
  rounded: number
  shadow: number
  cursorSize: number
}

const AUTO_CONFIGS: AutoConfig[] = [
  { gradientIndex: 0, padding: 0, rounded: 0, shadow: 0, cursorSize: 200 },
  { gradientIndex: 0, padding: 14, rounded: 0, shadow: 0, cursorSize: 200 },
  { gradientIndex: 0, padding: 14, rounded: 18, shadow: 0, cursorSize: 200 },
  { gradientIndex: 0, padding: 14, rounded: 18, shadow: 80, cursorSize: 200 },
  { gradientIndex: 0, padding: 14, rounded: 18, shadow: 80, cursorSize: 80 },
  { gradientIndex: 3, padding: 10, rounded: 24, shadow: 50, cursorSize: 150 },
]

const AUTO_STEP_DELAYS = [800, 1200, 2000, 2500, 2500, 3000]

const PREVIEW_CURSOR_DURATION = 8

const studioFeatures = [
  {
    icon: <Palette className="size-5" />,
    title: "Custom Backgrounds",
    description: "Gradients, wallpapers & colors",
  },
  {
    icon: <Maximize2 className="size-5" />,
    title: "Adjustable Padding",
    description: "Scale from 0% to 40%",
  },
  {
    icon: <Square className="size-5" />,
    title: "Rounded Corners",
    description: "Squircle or rounded styles",
  },
  {
    icon: <Wind className="size-5" />,
    title: "Motion Blur",
    description: "Natural movement effects",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Shadow & Borders",
    description: "Customizable depth effects",
  },
  {
    icon: <MousePointerClick className="size-5" />,
    title: "Cursor Effects",
    description: "Sizing, smoothing & click effects",
  },
]

const EASE = [0.4, 0, 0.2, 1] as const

const InteractiveSlider = ({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  onInteract,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (v: number) => void
  onInteract: () => void
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onChange(Math.round(min + pct * (max - min)))
    },
    [min, max, onChange]
  )

  const pct = max - min > 0 ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative flex h-5 cursor-pointer touch-none items-center"
        onPointerDown={(e) => {
          e.preventDefault()
          onInteract()
          isDraggingRef.current = true
          setDragging(true)
          trackRef.current?.setPointerCapture(e.pointerId)
          updateFromPointer(e.clientX)
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return
          updateFromPointer(e.clientX)
        }}
        onPointerUp={() => {
          isDraggingRef.current = false
          setDragging(false)
        }}
      >
        <div className="relative h-1 w-full rounded-full bg-muted">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-primary"
            style={{
              width: `${pct}%`,
              transition: dragging ? "none" : "width 0.6s ease",
            }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-sm shadow-primary/10"
            style={{
              left: `${pct}%`,
              transform: "translate(-50%, -50%)",
              transition: dragging ? "none" : "left 0.6s ease",
            }}
          />
        </div>
      </div>
    </div>
  )
}

const MockScreenContent = () => (
  <div className="h-full w-full overflow-hidden bg-background">
    <div className="flex items-center gap-1 border-b border-border bg-muted px-2 py-1.5">
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      </div>
      <div className="mx-auto h-2 max-w-[60px] flex-1 rounded bg-muted" />
    </div>
    <div className="flex h-[calc(100%-22px)]">
      <div className="flex w-5 flex-col gap-1.5 border-r border-border bg-muted p-1 pt-2">
        <div className="aspect-square w-full rounded bg-primary/80" />
        <div className="aspect-square w-full rounded bg-muted" />
        <div className="aspect-square w-full rounded bg-muted" />
      </div>
      <div className="flex-1 p-2">
        <div className="mb-2 h-2 w-3/4 rounded bg-muted" />
        <div className="mb-1 h-1.5 w-full rounded bg-muted" />
        <div className="mb-3 h-1.5 w-5/6 rounded bg-muted" />
        <div className="mb-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-lg border border-primary/80 bg-primary p-2">
            <div className="mb-1.5 h-1.5 w-3/4 rounded bg-primary/50" />
            <div className="h-1 w-full rounded bg-primary/70" />
          </div>
          <div className="rounded-lg border border-border bg-muted p-2">
            <div className="mb-1.5 h-1.5 w-2/3 rounded bg-muted" />
            <div className="h-1 w-full rounded bg-muted" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex h-4 items-center rounded bg-primary px-3">
            <div className="h-1 w-6 rounded bg-background/40" />
          </div>
          <div className="flex h-4 items-center rounded border border-border bg-muted px-3">
            <div className="h-1 w-8 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

const CursorSvg = ({ size = 18 }: { size?: number }) => {
  const height = Math.round((size / 18) * 25)
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 17 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cursor"
      className="drop-shadow-md"
    >
      <title>Cursor</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.501 3.2601L12.884 11.6611C13.937 12.7171 13.19 14.5191 11.699 14.5191L10.475 14.519L11.6908 17.4067C11.9038 17.9127 11.9068 18.4727 11.6998 18.9817C11.4918 19.4917 11.0978 19.8897 10.5898 20.1027C10.3338 20.2097 10.0658 20.2637 9.7918 20.2637C8.9608 20.2637 8.2158 19.7687 7.8938 19.0027L6.616 15.965L5.784 16.7031C4.703 17.6591 3 16.8921 3 15.4481V3.8811C3 3.0971 3.947 2.7051 4.501 3.2601Z"
        className="fill-primary-foreground"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4.53033C4 4.39933 4.159 4.33333 4.251 4.42633L12.159 12.3513C12.59 12.7833 12.284 13.5203 11.674 13.5203L8.97 13.5188L10.7696 17.7947C10.9966 18.3347 10.7426 18.9557 10.2036 19.1817C9.6626 19.4087 9.0426 19.1557 8.8166 18.6167L6.999 14.2928L5.139 15.9403C4.723 16.3083 4.0811 16.0518 4.007 15.5285L4 15.4273V4.53033Z"
        className="fill-foreground"
      />
    </svg>
  )
}

const MockEditor = () => {
  const [userInteracted, setUserInteracted] = useState(false)
  const [autoStep, setAutoStep] = useState(0)

  const [gradientIndex, setGradientIndex] = useState(0)
  const [padding, setPadding] = useState(0)
  const [rounded, setRounded] = useState(0)
  const [shadow, setShadow] = useState(0)
  const [cursorSize, setCursorSize] = useState(200)

  const [isPlaying, setIsPlaying] = useState(true)

  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">(
    "idle"
  )
  const [shareCopied, setShareCopied] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (userInteracted) return
    let timeout: ReturnType<typeof setTimeout>
    let cancelled = false

    const advance = (current: number) => {
      if (cancelled) return
      const next = (current + 1) % AUTO_CONFIGS.length
      const cfg = AUTO_CONFIGS[next]
      if (!cfg) return
      setGradientIndex(cfg.gradientIndex)
      setPadding(cfg.padding)
      setRounded(cfg.rounded)
      setShadow(cfg.shadow)
      setCursorSize(cfg.cursorSize)
      setAutoStep(next)
      timeout = setTimeout(() => advance(next), AUTO_STEP_DELAYS[next] || 2500)
    }

    timeout = setTimeout(() => advance(0), AUTO_STEP_DELAYS[0])

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [userInteracted])

  const handleInteraction = useCallback(() => {
    setUserInteracted(true)
  }, [])

  const handleExport = useCallback(() => {
    handleInteraction()
    if (exportState !== "idle") return
    setExportState("exporting")
    setTimeout(() => {
      setExportState("done")
      setTimeout(() => setExportState("idle"), 1500)
    }, 2000)
  }, [exportState, handleInteraction])

  const handleShare = useCallback(() => {
    handleInteraction()
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }, [handleInteraction])

  const handleRedDot = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }, [])

  const handleGradientClick = useCallback(
    (i: number) => {
      handleInteraction()
      setGradientIndex(gradientIndex === i ? -1 : i)
    },
    [handleInteraction, gradientIndex]
  )

  const handlePlayPause = useCallback(() => {
    handleInteraction()
    setIsPlaying((prev) => !prev)
  }, [handleInteraction])

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden select-none"
      animate={shaking ? { x: [0, -3, 3, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{`
				@keyframes previewCursorMove {
					0% { left: 20%; top: 25%; }
					15% { left: 55%; top: 42%; }
					30% { left: 72%; top: 22%; }
					50% { left: 40%; top: 58%; }
					65% { left: 28%; top: 68%; }
					85% { left: 62%; top: 35%; }
					100% { left: 20%; top: 25%; }
				}
				@keyframes previewProgress {
					0% { width: 0%; }
					100% { width: 100%; }
				}
			`}</style>
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted px-3 py-2 md:px-4 md:py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <motion.div
              className="h-2 w-2 cursor-pointer rounded-full bg-destructive md:h-2.5 md:w-2.5"
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.7 }}
              onClick={handleRedDot}
            />
            <motion.div
              className="h-2 w-2 cursor-pointer rounded-full bg-accent md:h-2.5 md:w-2.5"
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.7 }}
            />
            <motion.div
              className="h-2 w-2 cursor-pointer rounded-full bg-primary md:h-2.5 md:w-2.5"
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.7 }}
            />
          </div>
          <span className="ml-1 text-xs text-muted-foreground md:ml-2 md:text-xs">
            My Recording.theo
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <motion.button
            type="button"
            className="flex min-w-[40px] cursor-pointer items-center justify-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground md:px-2.5 md:py-1 md:text-xs"
            whileTap={{ scale: 0.93 }}
            onClick={handleShare}
          >
            {shareCopied ? (
              <>
                <Check className="size-2 text-primary md:size-2.5" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              "Share"
            )}
          </motion.button>
          <motion.button
            type="button"
            className="flex min-w-[40px] cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground md:px-2.5 md:py-1 md:text-xs"
            whileTap={{ scale: 0.93 }}
            onClick={handleExport}
          >
            <AnimatePresence mode="wait" initial={false}>
              {exportState === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  Export
                </motion.span>
              )}
              {exportState === "exporting" && (
                <motion.div
                  key="exporting"
                  className="h-1.5 w-8 overflow-hidden rounded-full bg-background/20 md:w-10"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-background"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
              {exportState === "done" && (
                <motion.span
                  key="done"
                  className="flex items-center gap-0.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="size-2.5 text-primary" />
                  Done!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted p-3 md:p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <motion.div
              className="absolute inset-0 bg-muted"
              initial={false}
              animate={{ opacity: gradientIndex === -1 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
            {GRADIENTS.map((grad, i) => (
              <motion.div
                key={grad}
                className="absolute inset-0"
                style={{ background: grad }}
                initial={false}
                animate={{ opacity: gradientIndex === i ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
            ))}

            <motion.div
              className="absolute z-10"
              initial={false}
              animate={{
                top: `${padding}%`,
                left: `${padding}%`,
                right: `${padding}%`,
                bottom: `${padding}%`,
              }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <motion.div
                className={`h-full w-full overflow-hidden ${
                  shadow > 0 ? "shadow-xl" : "shadow-none"
                }`}
                initial={false}
                animate={{
                  borderRadius: `${rounded}px`,
                }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <MockScreenContent />
              </motion.div>
            </motion.div>

            <div
              className="pointer-events-none absolute z-20"
              style={{
                left: "20%",
                top: "25%",
                animation: `previewCursorMove ${PREVIEW_CURSOR_DURATION}s ease-in-out infinite`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              <motion.div
                style={{ transformOrigin: "0 0" }}
                initial={false}
                animate={{ scale: cursorSize / 100 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <CursorSvg size={14} />
              </motion.div>
            </div>

            <div className="absolute right-0 bottom-0 left-0 z-30 flex items-center gap-1.5 bg-linear-to-t from-foreground/50 to-transparent px-2 py-1.5">
              <motion.button
                type="button"
                className="shrink-0 cursor-pointer"
                onClick={handlePlayPause}
                whileTap={{ scale: 0.8 }}
              >
                {isPlaying ? (
                  <Pause
                    className="size-3 text-primary-foreground"
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    className="ml-px size-3 text-primary-foreground"
                    fill="currentColor"
                  />
                )}
              </motion.button>
              <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-background/30">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-background/80"
                  style={{
                    width: "0%",
                    animation: `previewProgress ${PREVIEW_CURSOR_DURATION}s linear infinite`,
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                />
              </div>
              <span className="shrink-0 font-mono text-xs text-primary-foreground/70">
                0:12
              </span>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 z-20 md:hidden">
            <AnimatePresence mode="wait">
              {!userInteracted && AUTO_CONFIGS[autoStep] && (
                <motion.div
                  key={autoStep}
                  className="flex items-center gap-1.5 rounded-lg bg-foreground/75 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {autoStep === 0 || autoStep === 5
                    ? "Background"
                    : autoStep === 1
                      ? "Padding"
                      : autoStep === 2
                        ? "Corners"
                        : autoStep === 3
                          ? "Shadow"
                          : "Cursor Size"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden w-40 shrink-0 flex-col overflow-hidden border-l border-border bg-card md:flex lg:w-48 xl:w-52">
          <div className="flex shrink-0 items-center justify-around border-b border-border px-2 py-2">
            <div className="rounded-md bg-primary p-1 text-primary lg:p-1.5">
              <ImageIcon className="size-3" />
            </div>
            <div className="rounded-md p-1 text-muted-foreground lg:p-1.5">
              <Camera className="size-3" />
            </div>
            <div className="rounded-md p-1 text-muted-foreground lg:p-1.5">
              <Volume2 className="size-3" />
            </div>
            <div className="rounded-md p-1 text-muted-foreground lg:p-1.5">
              <MousePointer2 className="size-3" />
            </div>
            <div className="rounded-md p-1 text-muted-foreground lg:p-1.5">
              <MessageSquare className="size-3" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-2.5 lg:gap-3.5 lg:p-3">
            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">
                Background
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GRADIENT_COLORS.map(([from, to], i) => (
                  <motion.button
                    key={from}
                    type="button"
                    className="relative cursor-pointer"
                    onClick={() => handleGradientClick(i)}
                    whileTap={{ scale: 0.85 }}
                  >
                    <motion.div
                      className={`size-4 shrink-0 rounded-full lg:size-5 ${
                        gradientIndex === i
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "ring-1 ring-border"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                      }}
                      initial={false}
                      animate={{
                        scale: gradientIndex === i ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <InteractiveSlider
              label="Padding"
              value={padding}
              min={0}
              max={40}
              unit="%"
              onChange={setPadding}
              onInteract={handleInteraction}
            />

            <InteractiveSlider
              label="Rounded Corners"
              value={rounded}
              min={0}
              max={40}
              unit="px"
              onChange={setRounded}
              onInteract={handleInteraction}
            />

            <InteractiveSlider
              label="Shadow"
              value={shadow}
              min={0}
              max={100}
              unit="%"
              onChange={setShadow}
              onInteract={handleInteraction}
            />

            <div className="border-t border-border pt-2">
              <InteractiveSlider
                label="Cursor Size"
                value={cursorSize}
                min={30}
                max={300}
                unit="%"
                onChange={setCursorSize}
                onInteract={handleInteraction}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const StudioModeDetail = () => {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center md:mb-12"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <Clapperboard
            fill="var(--primary)"
            className="size-5"
            strokeWidth={1.5}
          />
          <span className="text-sm font-medium tracking-wider text-primary uppercase">
            Studio Mode
          </span>
        </div>
        <h2 className="mb-3 text-3xl font-medium text-foreground md:text-4xl">
          Record in full quality, edit before you share
        </h2>
        <p className="mx-auto max-w-[600px] text-base text-muted-foreground md:text-lg">
          Studio mode records at the highest quality directly to your device —
          no compression, no upload. Then customize backgrounds, padding,
          corners, and more before sharing.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.7,
          delay: 0.15,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="relative"
      >
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-b from-primary/20 via-primary/20 to-transparent blur-2xl md:-inset-8" />
        <div className="relative aspect-video min-h-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl md:rounded-2xl">
          <MockEditor />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 md:mt-8 md:grid-cols-3"
      >
        {studioFeatures.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 sm:gap-3 sm:p-4"
          >
            <div className="mt-0.5 shrink-0 text-primary">{feature.icon}</div>
            <div>
              <h4 className="text-sm font-medium text-foreground">
                {feature.title}
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:mt-10"
      >
        <Button href="/features/studio-mode" variant="white" size="lg">
          Learn more
        </Button>
        <UpgradeToPro />
      </motion.div>
    </div>
  )
}

export default StudioModeDetail
