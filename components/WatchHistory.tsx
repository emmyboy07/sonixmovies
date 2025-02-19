import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getUserData } from "@/lib/userDataManager"
import { formatDistanceToNow } from "date-fns"

export default function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState<Array<{ id: string; title: string; timestamp: number }>>([])

  useEffect(() => {
    const userData = getUserData()
    setWatchHistory(userData.watchHistory)
  }, [])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Watch History</h2>
      {watchHistory.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchHistory.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.id}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400">{formatDistanceToNow(movie.timestamp, { addSuffix: true })}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No watch history yet.</p>
      )}
    </div>
  )
}

