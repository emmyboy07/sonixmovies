"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

type Video = {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
}

type YouTubeVideoSliderProps = {
  videos: Video[]
}

export default function YouTubeVideoSlider({ videos }: YouTubeVideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length), 5000)

    return () => {
      resetTimeout()
    }
  }, [currentIndex, videos.length, resetTimeout]) // Added resetTimeout to dependencies

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? videos.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === videos.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (videos.length === 0) return null

  return (
    <div className="relative h-[25vh] md:h-[30vh] lg:h-[35vh] w-full overflow-hidden">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ cursor: "pointer" }}
        >
          <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">{video.title}</h2>
            <p className="text-lg mb-4 line-clamp-2">{video.channelTitle}</p>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push(`/nollywood/${video.id}`)}>
                <Play className="mr-2 h-4 w-4" /> Watch Now
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="ghost"
        className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

