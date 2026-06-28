"use client"

import { useEffect, useRef, useState } from "react"
import { AuthTestimonials } from "./auth-testimonials"

const POSTER_URL =
  "https://midday.ai/cdn-cgi/image/width=1000,quality=80,format=auto/https://cdn.midday.ai/video-poster-v2.jpg"
const VIDEO_URL = "https://cdn.midday.ai/videos/login-video.mp4"

export function AuthVideoPanel() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoad = () => setIsVideoLoaded(true)

    if (video.readyState >= 3) {
      setIsVideoLoaded(true)
    }

    video.addEventListener("canplay", handleLoad)
    video.addEventListener("loadeddata", handleLoad)
    video.addEventListener("canplaythrough", handleLoad)

    return () => {
      video.removeEventListener("canplay", handleLoad)
      video.removeEventListener("loadeddata", handleLoad)
      video.removeEventListener("canplaythrough", handleLoad)
    }
  }, [])

  return (
    <div className="relative m-2 hidden overflow-hidden lg:flex lg:w-1/2">
      <div
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-all duration-1000 ease-in-out ${
          isVideoLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ filter: isVideoLoaded ? "blur(0px)" : "blur(1px)" }}
      >
        <img alt="" className="h-full w-full object-cover" src={POSTER_URL} />
      </div>

      <video
        ref={videoRef}
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        loop
        muted
        playsInline
        poster={POSTER_URL}
        preload="auto"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-2 text-center">
        <div className="max-w-lg">
          <AuthTestimonials />
        </div>
      </div>
    </div>
  )
}
