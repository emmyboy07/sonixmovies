"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type MoviePlayerProps = {
  videoId: string
  server?: "server1" | "server2"
  season?: string
  episode?: string
  type: "movie" | "tv"
  onProgress?: (event: any) => void
  onEnded?: () => void
}

export default function MoviePlayer({
  videoId,
  server = "server1",
  season,
  episode,
  type,
  onProgress,
  onEnded,
}: MoviePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isDataSaverEnabled, setIsDataSaverEnabled] = useState(false) // Added state for data saver

  useEffect(() => {
    const loadVideo = () => {
      setIsLoading(true)
      setError(null)

      let videoUrl = ""
      if (type === "movie") {
        videoUrl =
          server === "server1"
            ? `https://www.2embed.cc/embed/${videoId}${isDataSaverEnabled ? "&quality=low" : ""}`
            : `https://www.2embed.stream/embed/movie/${videoId}${isDataSaverEnabled ? "&quality=low" : ""}`
      } else {
        const paddedSeason = season?.padStart(2, "0")
        const paddedEpisode = episode?.padStart(2, "0")

        videoUrl =
          server === "server1"
            ? `https://www.2embed.cc/embedtv/${videoId}&s=${paddedSeason}&e=${paddedEpisode}${isDataSaverEnabled ? "&quality=low" : ""}`
            : `https://www.2embed.stream/embed/tv/${videoId}/${paddedSeason}/${paddedEpisode}${isDataSaverEnabled ? "&quality=low" : ""}`
      }

      if (iframeRef.current) {
        iframeRef.current.src = videoUrl
      }
    }

    loadVideo()
  }, [videoId, server, season, episode, type, isDataSaverEnabled])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError("Error loading video. Please try a different server.")
    setIsLoading(false)
    toast.error("Failed to load video. Trying alternative server...")
  }

  useEffect(() => {
    const requestPictureInPicture = async () => {
      if (!document.pictureInPictureEnabled) {
        console.log("Picture-in-Picture is not supported in this browser.")
        return
      }

      try {
        if (iframeRef.current) {
          const video = iframeRef.current.querySelector("video")
          if (video && !document.pictureInPictureElement) {
            await video.requestPictureInPicture()
          }
        }
      } catch (error) {
        console.error("Failed to enter Picture-in-Picture mode:", error)
      }
    }

    if (!isLoading) {
      requestPictureInPicture()
    }
  }, [isLoading])

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="w-8 h-8 animate-spin text-sonix-red" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"}`}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        onTimeUpdate={onProgress}
        onEnded={onEnded}
      />
    </div>
  )
}

