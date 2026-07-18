"use client"

import { Button } from "@/components/product-ui"
import { type Rive, useRive } from "@/lib/rive"
import { productConfig } from "@workspace/config/public"
import { useCallback, useEffect, useRef, useState } from "react"

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

const RIVE_CLASS =
  "absolute inset-y-0 -left-2 my-auto h-[62px] w-[80px] scale-90 bottom-[22.5%]"

const ProRiveArt = ({ onReady }: { onReady: (rive: Rive | null) => void }) => {
  const { rive, RiveComponent } = useRive({
    src: "/rive/pricing.riv",
    artboard: "pro",
    animations: "idle",
    autoplay: false,
  })

  useEffect(() => {
    onReady(rive)
  }, [rive, onReady])

  return <RiveComponent className={RIVE_CLASS} />
}

const UpgradeToPro = ({
  text,
  onClick,
}: {
  text?: string
  onClick?: () => void
}) => {
  const label = text ?? `Upgrade to ${productConfig.name} Pro`
  const [shouldLoad, setShouldLoad] = useState(false)
  const riveRef = useRef<Rive | null>(null)

  useEffect(() => {
    if (shouldLoad) return

    const idleWindow = window as IdleWindow
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setShouldLoad(true), {
        timeout: 2000,
      })
      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const timeout = window.setTimeout(() => setShouldLoad(true), 1000)
    return () => window.clearTimeout(timeout)
  }, [shouldLoad])

  const handleReady = useCallback((rive: Rive | null) => {
    riveRef.current = rive
  }, [])

  return (
    <Button
      href="/pricing"
      onClick={onClick}
      onMouseEnter={() => {
        setShouldLoad(true)
        const rive = riveRef.current
        if (rive) {
          rive.stop()
          rive.play("items-coming-out")
        }
      }}
      className="relative flex w-full max-w-none cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-blue-800 bg-blue-600 px-6 text-white shadow-[0_1.50px_0_0_rgba(255,255,255,0.20)_inset] hover:bg-blue-700 md:max-w-[220px] md:justify-evenly md:overflow-visible"
      onMouseLeave={() => {
        const rive = riveRef.current
        if (rive) {
          rive.stop()
          rive.play("items-coming-in")
        }
      }}
      size="lg"
      variant="blue"
    >
      {shouldLoad ? <ProRiveArt onReady={handleReady} /> : null}
      <p className="relative font-medium text-white md:left-5">{label}</p>
    </Button>
  )
}

export default UpgradeToPro
