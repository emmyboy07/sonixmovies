import type { Metadata } from "next"
import { fetchMovieDetails } from "@/lib/api"
import MoviePageClient from "./MoviePageClient"

type MoviePageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = params.id
  const movie = await fetchMovieDetails(movieId)

  if (!movie) {
    return {
      title: "Movie Not Found",
    }
  }

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  return {
    title: `${movie.title} | Sonix Movies`,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [
        {
          url: imageUrl,
          width: 500,
          height: 750,
          alt: movie.title,
        },
      ],
      siteName: "Sonix Movies",
      type: "video.movie",
      videos: movie.videos?.results
        ? [
            {
              url: `https://www.youtube.com/watch?v=${movie.videos.results[0]?.key}`,
              width: 1280,
              height: 720,
              type: "video/mp4",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: movie.overview,
      images: [imageUrl],
      site: "@sonixmovies",
    },
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = params.id
  const movie = await fetchMovieDetails(movieId)

  return <MoviePageClient movie={movie} />
}

