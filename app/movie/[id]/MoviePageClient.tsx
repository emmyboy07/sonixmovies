"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Heart, Play, ArrowLeft } from "lucide-react"
import { ShareButton } from "@/components/ShareButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import HomeMoviePlayer from "@/components/HomeMoviePlayer"
import { ReportForm } from "@/components/ReportForm"
import { useAuth } from "@/components/AuthProvider"
import { toast } from "sonner"
import LoadingSpinner from "@/components/LoadingSpinner"

type MoviePageClientProps = {
  movie: any // Replace 'any' with a more specific type if available
}

export default function MoviePageClient({ movie }: MoviePageClientProps) {
  const router = useRouter()
  const [isWatching, setIsWatching] = useState(false)
  const { user, addToWatchHistory, addFavorite, removeFavorite, isFavorite } = useAuth()
  const [similarMovies, setSimilarMovies] = useState<any[]>([])
  const [trailerKey, setTrailerKey] = useState("")
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false)
  const [selectedServer, setSelectedServer] = useState("server1")
  const [isNavigating, setIsNavigating] = useState(false)
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false) // Added isLoadingSimilar state
  const trailerPlayerRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadSimilarMovies = async () => {
      const apiKey = "4047600e7b714de665db30e862139d92"

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSimilarMovies(data.results.filter((movie: any) => movie.poster_path).slice(0, 10))
      } catch (error) {
        console.error("Error loading similar movies:", error)
        toast.error("Failed to load similar movies. Please try again later.")
      }
    }

    const findTrailer = () => {
      const trailer = movie.videos.results.find((video: any) => video.type === "Trailer")
      if (trailer) {
        setTrailerKey(trailer.key)
      }
    }

    loadSimilarMovies()
    findTrailer()
  }, [movie.id, movie.videos])

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please log in to manage favorites.", {
        description: "Create an account or log in to use this feature.",
        action: {
          label: "Log In",
          onClick: () => router.push("/login"),
        },
      })
      return
    }

    const favorite = {
      id: movie.id.toString(),
      title: movie.title,
      type: "movie",
      poster_path: movie.poster_path,
    }

    if (isFavorite(movie.id.toString())) {
      removeFavorite(movie.id.toString())
      toast.success(`${movie.title} removed from favorites`)
    } else {
      addFavorite(favorite)
      toast.success(`${movie.title} added to favorites`)
    }
  }

  const handleWatchNow = () => {
    if (!user) {
      toast.error("Please log in to watch movies.", {
        description: "Create an account or log in to use this feature.",
        action: {
          label: "Log In",
          onClick: () => router.push("/login"),
        },
      })
      return
    }
    if (movie) {
      addToWatchHistory({
        id: movie.id.toString(),
        title: movie.title,
        type: "movie",
        poster_path: movie.poster_path,
        timestamp: Date.now(),
      })
    }
    setIsWatching(true)
    setIsPlayingTrailer(false)
  }

  const playTrailer = () => {
    if (trailerKey) {
      setIsPlayingTrailer(true)
      setIsWatching(false)
    }
  }

  const handleServerChange = (value: string) => {
    setSelectedServer(value)
    setIsWatching(true)
    setIsPlayingTrailer(false)
  }

  const handleVideoProgress = (progress: number) => {
    console.log("Video progress:", progress)
  }

  const handleSimilarMovieClick = (similarMovieId: string) => {
    // Added handleSimilarMovieClick function
    setIsLoadingSimilar(true)
    window.scrollTo(0, 0)
    router.push(`/movie/${similarMovieId}`)
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-sonix-black text-white flex items-center justify-center">Movie not found</div>
    )
  }
  isLoadingSimilar && <LoadingSpinner />

  return (
    <div className="min-h-screen bg-sonix-black text-white pb-16">
      <div className="container px-4 pt-4">
        <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 mr-2" /> Back
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster or Video Player */}
          <div className="w-full md:w-[720px] flex-shrink-0">
            <AspectRatio ratio={16 / 9}>
              {isWatching ? (
                <HomeMoviePlayer
                  videoId={movie.id.toString()}
                  server={selectedServer as "server1" | "server2"}
                  onProgress={handleVideoProgress}
                  autoplay={true}
                />
              ) : isPlayingTrailer ? (
                <iframe
                  ref={trailerPlayerRef}
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="rounded-lg"
                />
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </AspectRatio>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(movie.vote_average / 2) ? "text-yellow-400" : "text-gray-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4 mb-8 bg-black p-4 rounded-lg">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 hover:bg-transparent"
                onClick={handleToggleFavorite}
                aria-label={isFavorite(movie.id.toString()) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite(movie.id.toString()) ? "fill-sonix-red text-sonix-red" : "text-white"}`}
                />
                <span className="text-sm text-white">
                  {isFavorite(movie.id.toString()) ? "Unfavorite" : "Favorite"}
                </span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 hover:bg-transparent"
                onClick={playTrailer}
                disabled={!trailerKey}
                aria-label="Play trailer"
              >
                <Play className="w-6 h-6 text-white" />
                <span className="text-sm text-white">Trailer</span>
              </Button>
              <ReportForm contentId={movie.id.toString()} contentType="movie" contentTitle={movie.title} />
              <ShareButton
                title={movie.title}
                description={movie.overview}
                imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/movie/${movie.id}`}
                releaseDate={movie.release_date}
                runtime={movie.runtime ? movie.runtime.toString() : undefined}
                rating={movie.vote_average ? movie.vote_average.toFixed(1) : undefined}
                categories={movie.genres?.map((g: any) => g.name)}
                genre={movie.genres && movie.genres.length > 0 ? movie.genres[0].name : undefined}
                shareEpisodeData={user?.settings?.shareEpisodeData ?? true}
              />
            </div>
            {/* Watch Button */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                className="flex-1 bg-sonix-red text-white py-6 text-lg hover:bg-sonix-red"
                onClick={handleWatchNow}
              >
                <Play className="w-6 h-6 mr-2" /> Watch Now
              </Button>
              <Select value={selectedServer} onValueChange={handleServerChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select server" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server1">Server 1</SelectItem>
                  <SelectItem value="server2">Server 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Movie Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overview</h2>
                <p className="text-gray-300">{movie.overview}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Genres</h2>
                <p className="text-gray-300">{movie.genres.map((g: any) => g.name).join(" / ")}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="font-bold mb-1">Original Title</h3>
                  <p className="text-gray-300">{movie.original_title}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Original Language</h3>
                  <p className="text-gray-300">{movie.original_language.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Release Date</h3>
                  <p className="text-gray-300">{movie.release_date}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Runtime</h3>
                  <p className="text-gray-300">{movie.runtime} minutes</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Budget</h3>
                  <p className="text-gray-300">${movie.budget.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Revenue</h3>
                  <p className="text-gray-300">${movie.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Cast */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Cast</h2>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {movie.credits.cast
                    .filter((actor: any) => actor.profile_path)
                    .slice(0, 10)
                    .map((actor: any) => (
                      <div key={actor.id} className="flex-shrink-0 w-32">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={actor.name}
                          width={128}
                          height={192}
                          className="rounded-lg object-cover mb-2"
                        />
                        <p className="text-sm text-center font-semibold">{actor.name}</p>
                        <p className="text-xs text-center text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarMovies.map(
                (similarMovie) =>
                  similarMovie &&
                  similarMovie.id &&
                  similarMovie.title && (
                    <div
                      key={similarMovie.id}
                      className="cursor-pointer"
                      onClick={() => handleSimilarMovieClick(similarMovie.id.toString())} // Updated onClick handler
                    >
                      <AspectRatio ratio={2 / 3}>
                        <Image
                          src={
                            similarMovie.poster_path
                              ? `https://image.tmdb.org/t/p/w342${similarMovie.poster_path}`
                              : "/placeholder.svg"
                          }
                          alt={similarMovie.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </AspectRatio>
                      <p className="mt-2 text-center text-sm">{similarMovie.title}</p>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

