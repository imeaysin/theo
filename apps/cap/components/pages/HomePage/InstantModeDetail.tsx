"use client"

import { Button } from "@/components/cap-ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  Check,
  Copy,
  FileText,
  Globe,
  Link2,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import UpgradeToPro from "../_components/UpgradeToPro"

const instantFeatures = [
  {
    icon: <Link2 className="size-5" />,
    title: "Instant Links",
    description: "Shareable URL, immediately",
  },
  {
    icon: <Upload className="size-5" />,
    title: "Background Upload",
    description: "Uploads while you record",
  },
  {
    icon: <FileText className="size-5" />,
    title: "Auto Transcription",
    description: "AI-generated captions",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "AI Summaries",
    description: "Titles & descriptions",
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "Smart Chapters",
    description: "Auto-segmented timeline",
  },
  {
    icon: <Globe className="size-5" />,
    title: "Browser Viewing",
    description: "No downloads required",
  },
]

const EMOJIS = ["😂", "😍", "😮", "🙌", "👍", "👎"] as const

interface FloatingEmoji {
  id: number
  emoji: string
  x: number
}

const TABS = ["activity", "summary", "transcript"] as const
type TabKey = (typeof TABS)[number]

const featureContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const featureItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const formatTime = (seconds: number) => {
  const safe = Number.isFinite(seconds) ? seconds : 0
  const m = Math.floor(safe / 60)
  const s = Math.floor(safe % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

const MockSharePage = () => {
  const [emojiCounts, setEmojiCounts] = useState<Record<string, number>>({})
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([])
  const [linkCopied, setLinkCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("activity")
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [activeChapter, setActiveChapter] = useState<number | null>(null)
  const [tabInteracted, setTabInteracted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoLoadedRef = useRef(false)
  const userPausedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!videoLoadedRef.current) {
            video.src = "/illustrations/homepage-animation.mp4"
            videoLoadedRef.current = true
          }
          if (!userPausedRef.current) {
            video.play().catch(() => {})
            setIsPlaying(true)
          }
        } else {
          video.pause()
          setIsPlaying(false)
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (tabInteracted) return
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % TABS.length
      const nextTab = TABS[index]
      if (nextTab) {
        setActiveTab(nextTab)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [tabInteracted])

  const handleEmojiClick = useCallback((emoji: string, index: number) => {
    setEmojiCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }))

    const id = Date.now() + index
    const x = (Math.random() - 0.5) * 40
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }])

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id))
    }, 800)
  }, [])

  const handleCopyLink = useCallback(() => {
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }, [])

  const handleTabClick = useCallback((tab: TabKey) => {
    setTabInteracted(true)
    setActiveTab(tab)
  }, [])

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setIsPlaying(true)
      userPausedRef.current = false
    } else {
      video.pause()
      setIsPlaying(false)
      userPausedRef.current = true
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (v?.duration) {
      setProgress((v.currentTime / v.duration) * 100)
    }
  }, [])

  return (
    <div ref={containerRef} className="bg-muted select-none">
      <motion.div
        className="px-4 pt-4 md:px-6 md:pt-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-sm font-medium text-foreground md:text-lg">
          How to build a React component
        </h3>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 shrink-0 rounded-full bg-linear-to-br from-primary/20 to-primary/20 md:h-7 md:w-7" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground md:text-xs">
                John Doe
              </span>
              <span className="text-xs text-muted-foreground md:text-xs">
                2 minutes ago
              </span>
            </div>
          </div>
          <motion.button
            type="button"
            className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted md:px-3 md:py-1.5 md:text-xs"
            onClick={handleCopyLink}
            whileTap={{ scale: 0.95 }}
          >
            {linkCopied ? (
              <>
                <Check className="size-3 text-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                cap.link/m4k92x
                <Copy className="size-3 text-muted-foreground" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mt-3 flex flex-col gap-3 px-4 md:mt-4 md:gap-4 md:px-6 lg:flex-row"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex-1">
          <div className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border bg-linear-to-br from-muted to-muted md:rounded-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              loop
              preload="none"
              tabIndex={-1}
              onTimeUpdate={handleTimeUpdate}
            />

            <button
              type="button"
              className="absolute inset-0 z-5 cursor-pointer bg-transparent"
              onClick={handlePlayPause}
            />

            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-foreground/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm md:h-14 md:w-14"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <Play
                      className="ml-0.5 size-4 text-foreground md:size-6"
                      fill="currentColor"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`absolute right-0 bottom-0 left-0 z-20 transition-opacity duration-200 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-1.5 bg-linear-to-t from-foreground/50 to-transparent px-2 py-1.5 md:px-3 md:py-2">
                <button
                  type="button"
                  className="shrink-0 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause
                      className="size-3 text-primary-foreground md:size-4"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="ml-px size-3 text-primary-foreground md:size-4"
                      fill="currentColor"
                    />
                  )}
                </button>
                <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-background/30 md:h-1">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-background/80"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-xs text-primary-foreground/70 md:text-xs">
                  {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                  {formatTime(videoRef.current?.duration || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden w-56 flex-col overflow-hidden rounded-xl border border-border bg-background md:rounded-2xl lg:flex xl:w-64">
          <div className="flex border-b border-border">
            {(
              [
                ["activity", "Activity"],
                ["summary", "Summary"],
                ["transcript", "Transcript"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`flex-1 cursor-pointer px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === key
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-muted-foreground"
                }`}
                onClick={() => handleTabClick(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <AnimatePresence mode="wait">
              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10" />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Sarah M.
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        This is really helpful, thanks!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Mike R.
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Great walkthrough
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-purple-100" />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Alex K.
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Can you share the repo?
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Sparkles className="size-2.5" /> Generated by Cap AI
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    A step-by-step walkthrough of building a reusable React
                    component from scratch, covering props, state management,
                    and testing best practices.
                  </p>
                </motion.div>
              )}
              {activeTab === "transcript" && (
                <motion.div
                  key="transcript"
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex gap-2">
                    <span className="w-6 shrink-0 text-xs text-primary">
                      0:00
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Hey everyone, today we're going to build a React
                      component...
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-6 shrink-0 text-xs text-primary">
                      0:12
                    </span>
                    <span className="text-xs text-muted-foreground">
                      First, let's set up our project structure and install the
                      dependencies...
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-6 shrink-0 text-xs text-primary">
                      0:28
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Now let's create our component file and define the
                      props...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-3 flex justify-center px-4 md:mt-4 md:px-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="relative flex w-fit items-center gap-1 rounded-full border border-border bg-background p-1.5 md:gap-1.5 md:p-2">
          {EMOJIS.map((emoji, i) => (
            <motion.button
              key={emoji}
              type="button"
              className="font-emoji relative flex size-6 cursor-pointer items-center justify-center rounded-full text-xs hover:bg-muted md:size-8 md:text-base"
              onClick={() => handleEmojiClick(emoji, i)}
              whileTap={{ scale: 1.4 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              {emoji}
              <AnimatePresence>
                {(emojiCounts[emoji] || 0) > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-primary px-0.5 text-xs font-bold text-primary-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={emojiCounts[emoji]}
                  >
                    {emojiCounts[emoji]}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          <AnimatePresence>
            {floatingEmojis.map((fe) => (
              <motion.span
                key={fe.id}
                className="font-emoji pointer-events-none absolute text-lg md:text-xl"
                initial={{ opacity: 1, y: 0, x: fe.x }}
                animate={{ opacity: 0, y: -50, x: fe.x }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ bottom: "100%", left: "50%" }}
              >
                {fe.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          <div className="mx-1 hidden h-4 w-px bg-muted sm:block md:mx-2" />
          <motion.button
            type="button"
            className="flex cursor-pointer items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground md:px-3 md:py-1.5 md:text-xs"
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowCommentInput((prev) => !prev)}
          >
            <MessageCircle className="size-2.5" />
            Comment
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCommentInput && (
          <motion.div
            className="mt-2 px-4 md:px-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2">
              <div className="h-5 w-5 shrink-0 rounded-full bg-linear-to-br from-primary/20 to-primary/20" />
              <div className="flex-1 text-xs text-muted-foreground select-none">
                Add a comment...
              </div>
              <div className="rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-primary-foreground">
                Send
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-3 px-4 pb-4 md:mt-4 md:px-6 md:pb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="rounded-xl border border-border bg-background p-3 md:rounded-2xl md:p-4">
          <h4 className="text-xs font-medium text-foreground md:text-sm">
            Summary
          </h4>
          <span className="text-xs font-medium text-muted-foreground md:text-xs">
            Generated by Cap AI
          </span>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:mt-2 md:text-xs">
            A step-by-step walkthrough of building a reusable React component
            from scratch, covering props, state management, and testing best
            practices for production apps.
          </p>

          <h4 className="mt-3 mb-1.5 text-xs font-medium text-foreground md:mt-4 md:mb-2 md:text-sm">
            Chapters
          </h4>
          <div className="divide-gray-3 divide-y">
            {[
              { time: "0:00", title: "Introduction" },
              { time: "0:45", title: "Project setup" },
              { time: "1:30", title: "Building the component" },
            ].map((chapter, i) => (
              <motion.button
                key={chapter.time}
                type="button"
                className={`flex w-full cursor-pointer items-center rounded px-1.5 py-1.5 transition-colors md:px-2 md:py-2 ${
                  activeChapter === i ? "bg-primary" : "hover:bg-muted"
                }`}
                onClick={() => setActiveChapter(activeChapter === i ? null : i)}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`w-10 shrink-0 text-left text-xs md:w-14 md:text-xs ${
                    activeChapter === i
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {chapter.time}
                </span>
                <span
                  className={`text-xs md:text-xs ${
                    activeChapter === i
                      ? "font-medium text-primary"
                      : "text-foreground"
                  }`}
                >
                  {chapter.title}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {linkCopied && (
          <motion.div
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 md:bottom-5"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-lg md:gap-2 md:px-4 md:py-2 md:text-xs">
              <Check className="size-3 text-primary md:size-3.5" />
              Link copied to clipboard
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const InstantModeDetail = () => {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center md:mb-12"
      >
        <motion.div
          className="mb-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            <Zap fill="yellow" className="size-5" strokeWidth={1.5} />
          </motion.div>
          <span className="text-sm font-medium tracking-wider text-primary uppercase">
            Instant Mode
          </span>
        </motion.div>
        <motion.h2
          className="mb-3 text-3xl font-medium text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Share your screen or webcam instantly
        </motion.h2>
        <motion.p
          className="mx-auto max-w-[600px] text-base text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Hit record, stop, and share. Your video is live with an AI-generated
          title, summary, chapters, and transcript — all created automatically.
        </motion.p>
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
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
          <MockSharePage />
        </div>
      </motion.div>

      <motion.div
        variants={featureContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 md:mt-6 md:grid-cols-3"
      >
        {instantFeatures.map((feature) => (
          <motion.div
            key={feature.title}
            variants={featureItemVariants}
            whileHover={{
              y: -3,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }}
            className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 transition-shadow hover:border-primary hover:shadow-md sm:gap-3 sm:p-4"
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
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:mt-6"
      >
        <Button href="/features/instant-mode" variant="white" size="lg">
          Learn more
        </Button>
        <UpgradeToPro />
      </motion.div>
    </div>
  )
}

export default InstantModeDetail
