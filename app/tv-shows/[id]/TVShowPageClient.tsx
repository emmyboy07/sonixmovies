"use client"

import { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Heart, Play, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShareButton } from "@/components/ShareButton"
import { ReportForm } from "@/components/ReportForm"
import { useAuth } from "@/components/AuthProvider"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { getWatchHistory } from "@/lib/watchHistoryManager"
import { debounce } from "lodash"
import MoviePlayer from "@/components/MoviePlayer"
import LoadingSpinner from "@/components/LoadingSpinner"

const TMDB_API_KEY = "4047600e7b714de665db30e862139d92"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export default function TVShowPageClient({ show }: { show: any }) {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSeason = searchParams.get("season") || "1"
  const initialEpisode = searchParams.get("episode") || "1"
  const [showData, setShowData] = useState<any>(show)
  const [similarShows, setSimilarShows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, addFavorite, removeFavorite, isFavorite, addToWatchHistory } = useAuth()
  const [isWatching, setIsWatching] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(initialSeason)
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode)
  const [episodeInfo, setEpisodeInfo] = useState<any>(null)
  const [trailerKey, setTrailerKey] = useState("")
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false)
  const [selectedServer, setSelectedServer] = useState("server1")
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false)
  const [watchProgress, setWatchProgress] = useState(0)
  const [isEpisodeInfoOpen, setIsEpisodeInfoOpen] = useState(false)
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false)

  const loadEpisodeInfo = useCallback(async (showId: number, season: number, episode: number) => {
    setIsLoadingEpisode(true)
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/season/${season}/episode/${episode}?api_key=${TMDB_API_KEY}`,
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch episode details`)
      }
      const data = await response.json()
      setEpisodeInfo(data)
    } catch (error) {
      console.error("Error loading episode details:", error)
      setEpisodeInfo(null)
      toast.error("Failed to load episode details. Please try again.")
    } finally {
      setIsLoadingEpisode(false)
    }
  }, [])

  const loadSimilarShows = useCallback(async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/similar?api_key=${TMDB_API_KEY}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch similar shows`)
      }
      const data = await response.json()
      setSimilarShows(data.results.filter((item: any) => item.poster_path).slice(0, 10))
    } catch (error) {
      console.error("Error loading similar shows:", error)
      toast.error("Failed to load similar shows. Please try again later.")
    }
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadShowDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        setShowData(null)
        setSimilarShows([])
        setIsLoadingSimilar(false) // Reset loading state for similar shows
        setWatchProgress(0)

        const response = await fetch(
          `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`,
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch TV show details`)
        }
        const fetchedShowData = await response.json()
        setShowData(fetchedShowData)

        await loadSimilarShows()

        if (fetchedShowData?.videos?.results) {
          const trailer = fetchedShowData.videos.results.find((video: any) => video.type === "Trailer")
          if (trailer) {
            setTrailerKey(trailer.key)
          }
        }

        if (user) {
          const history = getWatchHistory(user.id, id as string)
          if (history) {
            setSelectedSeason(history.season)
            setSelectedEpisode(history.episode)
            setWatchProgress(history.progress)
          }
        }

        if (fetchedShowData) {
          await loadEpisodeInfo(fetchedShowData.id, Number(selectedSeason), Number(selectedEpisode))
        }
      } catch (error) {
        console.error("Error loading details:", error)
        setError("Failed to load TV show details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadShowDetails()
  }, [id, user, selectedSeason, selectedEpisode, loadEpisodeInfo, loadSimilarShows])

  const handleToggleFavorite = useCallback(() => {
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

    if (!showData) return

    const favorite = {
      id: showData.id.toString(),
      title: showData.name,
      type: "tv",
      poster_path: showData.poster_path,
    }

    if (isFavorite(showData.id.toString())) {
      removeFavorite(showData.id.toString())
      toast.success(`${showData.name} removed from favorites`)
    } else {
      addFavorite(favorite)
      toast.success(`${showData.name} added to favorites`)
    }
  }, [user, showData, isFavorite, removeFavorite, addFavorite, router])

  const handleWatchNow = () => {
    if (!user) {
      toast.error("Please log in to watch TV shows.", {
        description: "Create an account or log in to use this feature.",
        action: {
          label: "Log In",
          onClick: () => router.push("/login"),
        },
      })
      return
    }
    if (showData) {
      addToWatchHistory({
        id: showData.id.toString(),
        title: showData.name,
        type: "tv",
        poster_path: showData.poster_path,
        timestamp: Date.now(),
        season: selectedSeason,
        episode: selectedEpisode,
        progress: watchProgress,
      })
    }
    setIsWatching(true)
    setIsPlayingTrailer(false)
  }

  const handleServerChange = (value: string) => {
    setSelectedServer(value)
    setIsWatching(true)
    setIsPlayingTrailer(false)
  }

  const handleSeasonChange = useCallback(
    (value: string) => {
      setSelectedSeason(value)
      if (showData) {
        const newSeason = showData.seasons.find((s: any) => s.season_number.toString() === value)
        if (newSeason && Number(selectedEpisode) > newSeason.episode_count) {
          setSelectedEpisode("1")
        }
        loadEpisodeInfo(showData.id, Number(value), Number(selectedEpisode))
        if (user) {
          addToWatchHistory({
            id: showData.id.toString(),
            title: showData.name,
            type: "tv",
            poster_path: showData.poster_path,
            timestamp: Date.now(),
            season: value,
            episode: selectedEpisode,
            progress: 0,
          })
        }
      }
    },
    [showData, loadEpisodeInfo, user, addToWatchHistory, selectedEpisode],
  )

  const handleEpisodeChange = useCallback(
    (value: string) => {
      setSelectedEpisode(value)
      if (showData) {
        loadEpisodeInfo(showData.id, Number(selectedSeason), Number(value))
        if (user) {
          addToWatchHistory({
            id: showData.id.toString(),
            title: showData.name,
            type: "tv",
            poster_path: showData.poster_path,
            timestamp: Date.now(),
            season: selectedSeason,
            episode: value,
            progress: 0,
          })
        }
      }
    },
    [showData, selectedSeason, loadEpisodeInfo, user, addToWatchHistory],
  )

  const playTrailer = () => {
    if (trailerKey) {
      setIsPlayingTrailer(true)
      setIsWatching(false)
    }
  }

  const updateProgress = useCallback(
    debounce((progress: number) => {
      if (user && showData) {
        setWatchProgress(progress)
        addToWatchHistory({
          id: showData.id.toString(),
          title: showData.name,
          type: "tv",
          poster_path: showData.poster_path,
          timestamp: Date.now(),
          season: selectedSeason,
          episode: selectedEpisode,
          progress: progress,
        })
      }
    }, 1000),
    [],
  )

  const handleVideoProgress = useCallback(
    (event: any) => {
      const progress = (event.target.currentTime / event.target.duration) * 100
      updateProgress(progress)
    },
    [updateProgress],
  )

  const handleEpisodeEnd = useCallback(() => {
    if (!showData || !showData.seasons) return

    const currentEpisodeNumber = Number.parseInt(selectedEpisode, 10)
    const currentSeasonNumber = Number.parseInt(selectedSeason, 10)
    const currentSeason = showData.seasons.find((s: any) => s.season_number === currentSeasonNumber)

    if (!currentSeason) return

    if (currentEpisodeNumber < currentSeason.episode_count) {
      handleEpisodeChange((currentEpisodeNumber + 1).toString())
    } else if (currentSeasonNumber < showData.seasons.length) {
      handleSeasonChange((currentSeasonNumber + 1).toString())
      handleEpisodeChange("1")
    } else {
      setIsWatching(false)
      toast.info("You've reached the end of the series!")
    }
  }, [selectedEpisode, selectedSeason, showData, handleEpisodeChange, handleSeasonChange])

  const handleSimilarShowClick = (similarShowId: string) => {
    setIsLoadingSimilar(true)
    window.scrollTo(0, 0)
    router.push(`/tv-shows/${similarShowId}`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !showData) {
    return (
      <div className="min-h-screen bg-sonix-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-sonix-red mb-4">{error || "TV show data not available"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }
  isLoadingSimilar && <LoadingSpinner />

  return (
    <div className="min-h-screen bg-sonix-black text-white pb-16">
      <div className="container px-4 pt-4">
        <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 mr-2" /> Back
        </Button>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Poster or Video Player */}
          <div className="w-full md:w-[720px] flex-shrink-0">
            <AspectRatio ratio={16 / 9}>
              {isWatching ? (
                <MoviePlayer
                  videoId={showData.id.toString()}
                  server={selectedServer as "server1" | "server2"}
                  season={selectedSeason}
                  episode={selectedEpisode}
                  type="tv"
                  onProgress={handleVideoProgress}
                  onEnded={handleEpisodeEnd}
                />
              ) : isPlayingTrailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="rounded-lg"
                />
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${showData.backdrop_path || showData.poster_path}`}
                  alt={showData.name}
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </AspectRatio>
            {isWatching && <Progress value={watchProgress} className="w-full mt-2" />}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{showData.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span>{new Date(showData.first_air_date).getFullYear()}</span>
              <span>•</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(showData.vote_average / 2) ? "text-yellow-400" : "text-gray-600"
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
                aria-label={isFavorite(showData.id.toString()) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite(showData.id.toString()) ? "fill-sonix-red text-sonix-red" : "text-white"}`}
                />
                <span className="text-sm text-white">
                  {isFavorite(showData.id.toString()) ? "Unfavorite" : "Favorite"}
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
              <ReportForm contentId={showData.id.toString()} contentType="tv" contentTitle={showData.name} />
              <ShareButton
                title={showData.name}
                description={showData.overview}
                imageUrl={`https://image.tmdb.org/t/p/w500${showData.poster_path}`}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/tv-shows/${showData.id}`}
                releaseDate={showData.first_air_date}
                runtime={
                  showData.episode_run_time && showData.episode_run_time[0]
                    ? showData.episode_run_time[0].toString()
                    : undefined
                }
                rating={showData.adult ? "TV-MA" : "TV-14"}
                categories={showData.genres?.map((g: any) => g.name)}
                currentSeason={selectedSeason}
                currentEpisode={selectedEpisode}
                episodeInfo={episodeInfo}
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

            {/* Season and Episode Selection */}
            <div className="flex space-x-4 mb-8">
              <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  {showData.seasons?.map((season: any) => (
                    <SelectItem key={season.season_number} value={season.season_number.toString()}>
                      Season {season.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEpisode} onValueChange={handleEpisodeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Episode" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    {
                      length:
                        showData.seasons?.find((s: any) => s.season_number === Number(selectedSeason))?.episode_count ||
                        0,
                    },
                    (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Episode {i + 1}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Episode Information */}
            <div className="mb-8">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center mb-4 hover:bg-transparent"
                onClick={() => setIsEpisodeInfoOpen(!isEpisodeInfoOpen)}
              >
                <span>Episode Information</span>
                {isEpisodeInfoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {isEpisodeInfoOpen && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  {isLoadingEpisode ? (
                    <p className="text-center">Loading episode information...</p>
                  ) : episodeInfo ? (
                    <>
                      <h3 className="text-xl font-bold mb-2">
                        S{selectedSeason} E{selectedEpisode}: {episodeInfo.name || "Untitled Episode"}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">Air date: {episodeInfo.air_date || "Not available"}</p>
                      <p className="text-gray-300 mb-2">
                        {episodeInfo.overview || "No overview available for this episode."}
                      </p>
                      <p className="text-sm text-gray-300">
                        Runtime: {episodeInfo.runtime ? `${episodeInfo.runtime} minutes` : "Not available"}
                      </p>
                      {watchProgress > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-300 mb-1">Watch Progress:</p>
                          <Progress value={watchProgress} className="w-full" />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center">No episode information available.</p>
                  )}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overview</h2>
                <p className="text-gray-300">{showData.overview}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Genres</h2>
                <p className="text-gray-300">{showData.genres.map((g: any) => g.name).join(" / ")}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="font-bold mb-1">Original Name</h3>
                  <p className="text-gray-300">{showData.original_name}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Original Language</h3>
                  <p className="text-gray-300">{showData.original_language.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">First Air Date</h3>
                  <p className="text-gray-300">{showData.first_air_date}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Status</h3>
                  <p className="text-gray-300">{showData.status}</p>
                </div>
              </div>

              {/* Cast */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Cast</h2>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {showData.credits?.cast
                    ?.filter((actor: any) => actor.profile_path)
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

        {/* Similar Shows */}
        {similarShows.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Similar Shows</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarShows.map(
                (similarShow) =>
                  similarShow &&
                  similarShow.id &&
                  similarShow.name && (
                    <div
                      key={similarShow.id}
                      className="cursor-pointer"
                      onClick={() => handleSimilarShowClick(similarShow.id.toString())}
                    >
                      <AspectRatio ratio={2 / 3}>
                        <Image
                          src={
                            similarShow.poster_path
                              ? `https://image.tmdb.org/t/p/w342${similarShow.poster_path}`
                              : "/placeholder.svg"
                          }
                          alt={similarShow.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </AspectRatio>
                      <p className="mt-2 text-center text-sm">{similarShow.name}</p>
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

