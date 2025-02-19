"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/AuthProvider"

type HomeMoviePlayerProps = {
  videoId: string
  server?: "server1" | "server2"
  onProgress?: (event: any) => void
  autoplay?: boolean
}

export default function HomeMoviePlayer({
  videoId,
  server = "server1",
  onProgress,
  autoplay = false,
}: HomeMoviePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { user } = useAuth()
  const isDataSaverEnabled = user?.settings?.dataSaver ?? false

  useEffect(() => {
    const loadVideo = () => {
      setIsLoading(true)
      setError(null)

      const videoUrl =
        server === "server1"
          ? `https://www.2embed.cc/embed/${videoId}${isDataSaverEnabled ? "&quality=low" : ""}`
          : `https://www.2embed.stream/embed/movie/${videoId}${isDataSaverEnabled ? "&quality=low" : ""}`

      console.debug("Loading video URL:", videoUrl) // For debugging

      if (iframeRef.current) {
        iframeRef.current.src = videoUrl
      }
    }

    loadVideo()
  }, [videoId, server, isDataSaverEnabled])

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
      />
    </div>
  )
}

