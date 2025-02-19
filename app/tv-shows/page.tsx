"use client"

import { useRef, useCallback, Suspense } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import LoadingSpinner from "@/components/LoadingSpinner"
import SeriesGrid from "./SeriesGrid"
import { useSearchParams } from "next/navigation"
import ContinueWatchingGrid from "@/components/ContinueWatchingGrid"
import { useAuth } from "@/components/AuthProvider"

const TMDB_API_KEY = "4047600e7b714de665db30e862139d92"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

const fetchPopularTVShows = async (page = 1) => {
  const response = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch TV shows")
  const data = await response.json()
  return data.results
}

const searchTVShows = async (query: string, page = 1) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
  )
  if (!response.ok) throw new Error("Failed to search TV shows")
  const data = await response.json()
  return data.results
}

function TVShowsContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")
  const { user } = useAuth()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading } = useInfiniteQuery({
    queryKey: ["popularTVShows", searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      searchQuery ? searchTVShows(searchQuery, pageParam) : fetchPopularTVShows(pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.length ? pages.length + 1 : undefined),
  })

  const observer = useRef<IntersectionObserver>()
  const lastShowElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  )

  if (isLoading) return <LoadingSpinner />
  if (status === "error")
    return <div className="container mx-auto px-4 py-8 pt-16 text-red-500">Error fetching TV shows</div>

  const shows = data?.pages.flat() || []

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 py-8">
        {!searchQuery && <ContinueWatchingGrid mediaType="tv" />}
        <h2 className="text-2xl font-bold mb-4 mt-8 text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular TV Shows"}
        </h2>
        {shows.length > 0 ? (
          <SeriesGrid series={shows} lastSeriesRef={lastShowElementRef} />
        ) : (
          <p className="text-white">No results found.</p>
        )}
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  )
}

export default function TVShowsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TVShowsContent />
    </Suspense>
  )
}

