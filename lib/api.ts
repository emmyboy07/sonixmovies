import { handleApiError } from "./error-handling"
import type { Movie } from "./types"

const TMDB_API_KEY = "4047600e7b714de665db30e862139d92"
const BASE_URL = "https://api.themoviedb.org/3"
const YOUTUBE_API_KEY = "AIzaSyB073rVyNEwqTlWDoodMMIAwKcasgsPKuM"

export async function fetchMovies(page = 1): Promise<Movie[]> {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }
    const data = await response.json()
    const uniqueMovies = Array.from(new Set(data.results.map((m: Movie) => JSON.stringify(m)))).map((s: string) =>
      JSON.parse(s),
    )
    return uniqueMovies
  } catch (error) {
    return handleApiError(error)
  }
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    )
    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.statusText}`)
    }
    const data = await response.json()
    return data.results
  } catch (error) {
    return handleApiError(error)
  }
}

export async function fetchNollywoodYouTubeVideos(maxResults = 50, pageToken?: string, excludeShorts = false) {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search")
    url.searchParams.append("part", "snippet")
    url.searchParams.append("q", "nollywood movies")
    url.searchParams.append("type", "video")
    url.searchParams.append("maxResults", maxResults.toString())
    url.searchParams.append("key", YOUTUBE_API_KEY)
    if (pageToken) {
      url.searchParams.append("pageToken", pageToken)
    }
    if (excludeShorts) {
      url.searchParams.append("videoDuration", "long")
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      items:
        data.items?.map((item: any) => ({
          id: item.id?.videoId,
          title: item.snippet?.title,
          thumbnail: item.snippet?.thumbnails?.medium?.url,
          channelTitle: item.snippet?.channelTitle,
          publishedAt: item.snippet?.publishedAt,
        })) || [],
      nextPageToken: data.nextPageToken,
    }
  } catch (error) {
    console.error("Error fetching Nollywood videos:", error)
    return { items: [], nextPageToken: undefined }
  }
}

export async function searchNollywoodVideos(query: string, maxResults = 50, pageToken?: string, excludeShorts = false) {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search")
    url.searchParams.append("part", "snippet")
    url.searchParams.append("q", `nollywood movies ${query}`)
    url.searchParams.append("type", "video")
    url.searchParams.append("maxResults", maxResults.toString())
    url.searchParams.append("key", YOUTUBE_API_KEY)
    if (pageToken) {
      url.searchParams.append("pageToken", pageToken)
    }
    if (excludeShorts) {
      url.searchParams.append("videoDuration", "long")
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      items: data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: data.nextPageToken,
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export async function fetchRandomPopularMovies(count: number): Promise<Movie[]> {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
    if (!response.ok) {
      throw new Error(`Failed to fetch popular movies: ${response.statusText}`)
    }
    const data = await response.json()
    const shuffled = data.results.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function fetchMovieDetails(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`,
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export async function fetchTVShowDetails(showId: string) {
  try {
    const response = await fetch(`${BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`)
    if (!response.ok) {
      throw new Error(`Failed to fetch TV show details: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export async function fetchNollywoodVideoDetails(videoId: string) {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos")
    url.searchParams.append("part", "snippet,contentDetails,statistics")
    url.searchParams.append("id", videoId)
    url.searchParams.append("key", YOUTUBE_API_KEY)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.statusText}`)
    }
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      return data.items[0]
    } else {
      throw new Error("Video not found")
    }
  } catch (error) {
    return handleApiError(error)
  }
}

