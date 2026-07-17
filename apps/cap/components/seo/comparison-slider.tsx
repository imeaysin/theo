"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

const IMAGE_WIDTH = 1000
const IMAGE_HEIGHT = 600

interface ImageMetrics {
  imageDisplayWidth: number
  imageDisplayHeight: number
  imageStartX: number
  imageStartY: number
}

function getImageMetrics(container: HTMLDivElement): ImageMetrics {
  const rect = container.getBoundingClientRect()
  const scale = Math.min(rect.width / IMAGE_WIDTH, rect.height / IMAGE_HEIGHT)
  const imageDisplayWidth = IMAGE_WIDTH * scale
  const imageDisplayHeight = IMAGE_HEIGHT * scale

  return {
    imageDisplayWidth,
    imageDisplayHeight,
    imageStartX: (rect.width - imageDisplayWidth) / 2,
    imageStartY: (rect.height - imageDisplayHeight) / 2,
  }
}

function getConstrainedPosition(
  metrics: ImageMetrics,
  sliderPosition: number
): string {
  const { imageDisplayWidth, imageStartX } = metrics
  const position = imageStartX + (sliderPosition / 100) * imageDisplayWidth
  const clampedPosition = Math.max(
    imageStartX,
    Math.min(imageStartX + imageDisplayWidth, position)
  )

  return `${clampedPosition}px`
}

interface ComparisonSliderProps {
  leftImage: string
  rightImage: string
  leftAlt: string
  rightAlt: string
  leftLabel: string
  rightLabel: string
}

export const ComparisonSlider = ({
  leftImage,
  rightImage,
  leftAlt,
  rightAlt,
  leftLabel,
  rightLabel,
}: ComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [imageMetrics, setImageMetrics] = useState<ImageMetrics | null>(null)
  const constrainedPosition = imageMetrics
    ? getConstrainedPosition(imageMetrics, sliderPosition)
    : "50%"

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    // Bounce back to center after dragging
    setTimeout(() => {
      setSliderPosition(50)
    }, 100)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !container) return

      const rect = container.getBoundingClientRect()
      const { imageDisplayWidth, imageStartX } = getImageMetrics(container)
      const imageEndX = imageStartX + imageDisplayWidth

      const x = e.clientX - rect.left

      // Only update if cursor is within image bounds
      if (x < imageStartX || x > imageEndX) return

      const percentage = ((x - imageStartX) / imageDisplayWidth) * 100
      const clampedPercentage = Math.max(0, Math.min(100, percentage))
      setSliderPosition(clampedPercentage)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !container) return

      const rect = container.getBoundingClientRect()
      const { imageDisplayWidth, imageStartX } = getImageMetrics(container)
      const imageEndX = imageStartX + imageDisplayWidth

      const touch = e.touches[0]
      if (!touch) return
      const x = touch.clientX - rect.left

      // Only update if touch is within image bounds
      if (x < imageStartX || x > imageEndX) return

      const percentage = ((x - imageStartX) / imageDisplayWidth) * 100
      const clampedPercentage = Math.max(0, Math.min(100, percentage))
      setSliderPosition(clampedPercentage)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [container, handleMouseUp, isDragging])

  // Recompute metrics on container/window resize
  useEffect(() => {
    if (!container) return

    const updateMetrics = () => setImageMetrics(getImageMetrics(container))
    const rafId = window.requestAnimationFrame(updateMetrics)
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(updateMetrics)

    window.addEventListener("resize", updateMetrics)
    resizeObserver?.observe(container)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", updateMetrics)
      resizeObserver?.disconnect()
    }
  }, [container])

  return (
    <div className="xs:h-[525px] mx-auto h-[400px] w-full max-w-5xl px-5 sm:h-[600px] md:h-[700px]">
      <div
        ref={setContainer}
        className="relative h-full w-full overflow-hidden rounded-xl select-none"
        style={{ userSelect: "none" }}
        aria-label="Click anywhere on the image to move the comparison slider"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            const rect = container?.getBoundingClientRect()
            if (rect) {
              setSliderPosition(50)
            }
          }
        }}
      >
        {/* Left Image (Base layer) */}
        <motion.div className="absolute inset-0 z-5 flex items-center justify-center">
          <Image
            src={leftImage}
            alt={leftAlt}
            width={1000}
            height={600}
            quality={100}
            loading="eager"
            className="object-contain"
          />
        </motion.div>

        {/* Right Image (Clipped overlay) */}
        <motion.div
          initial={{
            // Use percentage before measurements to avoid overflow
            clipPath: "inset(0 0 0 50%)",
          }}
          animate={{
            clipPath: `inset(0 0 0 ${constrainedPosition})`,
          }}
          transition={{
            duration: isDragging ? 0 : 0.3,
            ease: "easeOut",
            delay: 0.2,
            clipPath: {
              duration: isDragging ? 0 : 0.3,
            },
          }}
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
        >
          <Image
            src={rightImage}
            alt={rightAlt}
            width={1000}
            height={600}
            quality={100}
            loading="eager"
            className="object-contain"
          />

          {imageMetrics && (
            <motion.div
              className="pointer-events-none absolute z-15"
              initial={{ left: constrainedPosition }}
              animate={{ left: constrainedPosition }}
              transition={{ duration: isDragging ? 0 : 0.3 }}
              style={{
                top: `${imageMetrics.imageStartY + imageMetrics.imageDisplayHeight / 2}px`,
                height: `${imageMetrics.imageDisplayHeight}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="h-full w-0.5 bg-linear-to-b from-transparent via-muted to-transparent shadow-sm" />
            </motion.div>
          )}
        </motion.div>

        {/* Slider Handle */}
        <motion.div
          className="absolute top-0 bottom-0 z-20 flex items-center"
          initial={{ left: constrainedPosition }}
          animate={{ left: constrainedPosition }}
          transition={{ duration: isDragging ? 0 : 0.3 }}
          style={{ transform: "translateX(-50%)" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="relative">
            {/* Vertical Line */}
            <div className="h-full w-0.5 bg-background shadow-lg" />

            {/* Handle Bubble */}
            <div className="absolute top-1/2 left-1/2 flex min-w-fit -translate-x-1/2 -translate-y-1/2 scale-[0.8] transform cursor-grab items-center justify-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 shadow-lg transition-transform hover:scale-110 sm:scale-100">
              <p className="text-sm text-muted-foreground">{leftLabel}</p>
              <p className="text-lg font-medium text-muted-foreground">vs</p>
              <p className="text-sm text-muted-foreground">{rightLabel}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
