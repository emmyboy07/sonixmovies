"use client"

import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Movie = {
  id: string
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
}

type MovieGridProps = {
  movies: Movie[]
  lastMovieRef?: (node: HTMLDivElement) => void
}

const MovieGrid = ({ movies, lastMovieRef }: MovieGridProps) => {
  const router = useRouter()
  const filteredMovies = movies.filter((movie) => movie.poster_path !== null)

  const handleMovieClick = useCallback(
    (movieId: string) => {
      router.push(`/movie/${movieId}`)
    },
    [router],
  )

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {filteredMovies.map((movie, index) => (
        <div
          key={`${movie.id}-${index}`}
          ref={index === filteredMovies.length - 1 ? lastMovieRef : undefined}
          className="cursor-pointer"
          onClick={() => handleMovieClick(movie.id)}
        >
          <Card className="bg-sonix-black">
            <CardContent className="p-0">
              <AspectRatio ratio={2 / 3}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </AspectRatio>
              <div className="p-2 sm:p-4">
                <h3 className="font-semibold truncate text-white text-[10px] sm:text-xs md:text-sm">{movie.title}</h3>
                <div className="flex items-center justify-between text-[8px] sm:text-xs text-gray-400">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default MovieGrid

