"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useAuth } from "@/components/AuthProvider"

type WatchHistoryItem = {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
  timestamp: number
  season?: number
  episode?: number
}

type ContinueWatchingGridProps = {
  mediaType: "movie" | "tv"
}

export default function ContinueWatchingGrid({ mediaType }: ContinueWatchingGridProps) {
  const { user, updateUser } = useAuth()
  const [watchHistory, setWatchHistory] = useState<Array<WatchHistoryItem>>([])
  const [reminder, setReminder] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && user.watchHistory) {
      const filteredHistory = Object.values(user.watchHistory)
        .filter((item) => item.type === mediaType)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
      setWatchHistory(filteredHistory)
    }
  }, [user, mediaType])

  const handleRemove = (id: string) => {
    if (user && user.watchHistory) {
      const updatedWatchHistory = { ...user.watchHistory }
      delete updatedWatchHistory[id]
      updateUser({ watchHistory: updatedWatchHistory })
      setWatchHistory(watchHistory.filter((item) => item.id !== id))
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  if (watchHistory.length === 0) return null

  return (
    <div className="mt-8 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">Continue Watching</h2>
      {reminder && <div className="bg-sonix-red text-white p-4 rounded-md mb-4">{reminder}</div>}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {watchHistory.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex-shrink-0 w-36 relative">
              <Link
                href={
                  item.type === "movie"
                    ? `/movie/${item.id}`
                    : `/tv-shows/${item.id}?season=${item.season}&episode=${item.episode}`
                }
              >
                <Card className="bg-sonix-black transition-transform duration-200 hover:scale-105">
                  <CardContent className="p-0">
                    <AspectRatio ratio={2 / 3}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </AspectRatio>
                    <div className="p-2">
                      <h3 className="font-semibold truncate text-white text-xs">{item.title}</h3>
                      <div className="flex items-center text-xs text-gray-400">
                        <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                      </div>
                      {item.type === "tv" && item.season && item.episode && (
                        <p className="text-xs text-gray-400">
                          S{item.season.toString().padStart(2, "0")} E{item.episode.toString().padStart(2, "0")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                onClick={() => handleRemove(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

