import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"

export const WatchHistoryList: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || Object.keys(user.watchHistory).length === 0) {
    return <p>No watch history available.</p>
  }

  const sortedHistory = Object.values(user.watchHistory).sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sortedHistory.map((item) => (
        <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title}
            width={500}
            height={750}
            className="w-full h-auto"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            {item.type === "tv" && (
              <p className="text-sm text-gray-400 mb-2">
                S{item.season} E{item.episode}
              </p>
            )}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-sonix-red h-2.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
            </div>
            <Button
              onClick={() => router.push(`/${item.type === "movie" ? "movie" : "tv-shows"}/${item.id}`)}
              className="w-full bg-sonix-red hover:bg-red-700"
            >
              Resume
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

