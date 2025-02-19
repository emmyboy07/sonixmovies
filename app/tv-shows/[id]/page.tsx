import type { Metadata } from "next"
import { fetchTVShowDetails } from "@/lib/api"
import TVShowPageClient from "./TVShowPageClient"

type TVShowPageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: TVShowPageProps): Promise<Metadata> {
  const showId = params.id
  const show = await fetchTVShowDetails(showId)

  if (!show) {
    return {
      title: "TV Show Not Found",
    }
  }

  const imageUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`

  return {
    title: `${show.name} | Sonix Movies`,
    description: show.overview,
    openGraph: {
      title: show.name,
      description: show.overview,
      images: [
        {
          url: imageUrl,
          width: 500,
          height: 750,
          alt: show.name,
        },
      ],
      siteName: "Sonix Movies",
      type: "video.episode",
      videos: show.videos?.results
        ? [
            {
              url: `https://www.youtube.com/watch?v=${show.videos.results[0]?.key}`,
              width: 1280,
              height: 720,
              type: "video/mp4",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: show.name,
      description: show.overview,
      images: [imageUrl],
      site: "@sonixmovies",
    },
  }
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const showId = params.id
  const show = await fetchTVShowDetails(showId)

  return <TVShowPageClient show={show} />
}

