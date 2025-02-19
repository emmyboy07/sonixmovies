import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getUserData } from "@/lib/userDataManager"
import { formatDistanceToNow } from "date-fns"

export default function LastWatched() {
  const [lastWatched, setLastWatched] = useState<{ id: string; title: string; timestamp: number } | null>(null)

  useEffect(() => {
    const userData = getUserData()
    setLastWatched(userData.lastWatchedMovie || null)
  }, [])

  if (!lastWatched) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
      <Link href={`/movie/${lastWatched.id}`}>
        <div className="bg-gray-800 rounded-lg overflow-hidden flex items-center">
          <Image
            src={`https://image.tmdb.org/t/p/w200${lastWatched.id}`}
            alt={lastWatched.title}
            width={100}
            height={150}
            className="w-1/3 h-auto"
          />
          <div className="p-4 w-2/3">
            <h3 className="text-lg font-semibold">{lastWatched.title}</h3>
            <p className="text-sm text-gray-400">
              Last watched: {formatDistanceToNow(lastWatched.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

