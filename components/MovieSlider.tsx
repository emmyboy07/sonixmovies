"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/lib/types"

type MovieSliderProps = {
  movies: Movie[]
}

export default function MovieSlider({ movies }: MovieSliderProps) {
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
    if (movies && movies.length > 0) {
      timeoutRef.current = setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length), 5000)
    }

    return () => {
      resetTimeout()
    }
  }, [currentIndex, movies, resetTimeout]) // Added resetTimeout to dependencies

  const goToPrevious = () => {
    if (movies && movies.length > 0) {
      const isFirstSlide = currentIndex === 0
      const newIndex = isFirstSlide ? movies.length - 1 : currentIndex - 1
      setCurrentIndex(newIndex)
    }
  }

  const goToNext = () => {
    if (movies && movies.length > 0) {
      const isLastSlide = currentIndex === movies.length - 1
      const newIndex = isLastSlide ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
    }
  }

  const goToMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`)
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className="relative h-[25vh] md:h-[30vh] lg:h-[35vh] w-full overflow-hidden">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{movie.title}</h2>
            <p className="text-xs sm:text-sm mb-2 line-clamp-2">{movie.overview}</p>
            <div className="flex items-center space-x-4">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToMovie(movie.id)
                }}
                size="sm"
              >
                <Play className="mr-2 h-4 w-4" /> Play
              </Button>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">★ {movie.vote_average.toFixed(1)}</span>
                <span className="text-xs">{movie.release_date.split("-")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="ghost"
        className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToPrevious()
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToNext()
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

