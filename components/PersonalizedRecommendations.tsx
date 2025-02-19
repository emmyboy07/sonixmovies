"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import Link from "next/link"

type Show = {
  id: number
  name: string
  poster_path: string
}

const TMDB_API_KEY = "4047600e7b714de665db30e862139d92"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export function PersonalizedRecommendations({
  currentShowId,
  currentGenres,
}: {
  currentShowId: number
  currentGenres: number[]
}) {
  const [recommendations, setRecommendations] = useState<Show[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return

      // Fetch user's viewing history and preferences
      const viewingHistory = user.viewingHistory || []
      const genrePreferences = user.genrePreferences || {}

      // Combine current show genres with user's genre preferences
      const combinedGenres = [...new Set([...currentGenres, ...Object.keys(genrePreferences).map(Number)])]

      // Fetch recommendations based on genres
      const genreParams = combinedGenres.join(",")
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreParams}&sort_by=popularity.desc&page=1`,
      )
      const data = await response.json()

      // Filter out the current show and already viewed shows
      const filteredRecommendations = data.results
        .filter((show: Show) => show.id !== currentShowId && !viewingHistory.includes(show.id))
        .slice(0, 5)

      setRecommendations(filteredRecommendations)
    }

    fetchRecommendations()
  }, [user, currentShowId, currentGenres])

  if (!user || recommendations.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommendations.map((show) => (
          <Link key={show.id} href={`/tv-shows/${show.id}`}>
            <Card className="bg-sonix-black transition-transform duration-200 hover:scale-105">
              <CardContent className="p-0">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </AspectRatio>
                <div className="p-2">
                  <h3 className="font-semibold truncate text-white text-sm">{show.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

