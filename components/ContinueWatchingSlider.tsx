import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getUserData, removeFromWatchHistory } from "@/lib/userDataManager"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ContinueWatchingSlider() {
  const [watchHistory, setWatchHistory] = useState<
    Array<{
      id: string
      title: string
      type: "movie" | "tv"
      poster_path: string
      timestamp: number
      season?: number
      episode?: number
    }>
  >([])

  useEffect(() => {
    const userData = getUserData()
    setWatchHistory(userData.watchHistory.slice(0, 10)) // Display only the 10 most recent items
  }, [])

  const handleRemove = (id: string, type: "movie" | "tv") => {
    removeFromWatchHistory(id, type)
    setWatchHistory((prev) => prev.filter((item) => item.id !== id))
  }

  if (watchHistory.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Continue Watching</h2>
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {watchHistory.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex-shrink-0 w-36 relative">
              <Link href={`/${item.type === "movie" ? "movie" : "tv-shows"}/${item.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(item.timestamp, { addSuffix: true })}</p>
                    {item.type === "tv" && item.season && item.episode && (
                      <p className="text-xs text-gray-400">
                        S{item.season} E{item.episode}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                onClick={() => handleRemove(item.id, item.type)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

