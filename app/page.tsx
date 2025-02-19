"use client"

import { useRef, useCallback, Suspense, useState, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchMovies, fetchRandomPopularMovies, searchMovies } from "@/lib/api"
import MovieGrid from "@/components/MovieGrid"
import MovieSlider from "@/components/MovieSlider"
import ContinueWatchingGrid from "@/components/ContinueWatchingGrid"
import { useSearchParams } from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/components/AuthProvider"

function HomeContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")
  const [uniqueMovies, setUniqueMovies] = useState<Record<string, boolean>>({})

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading } = useInfiniteQuery({
    queryKey: ["movies", searchQuery],
    queryFn: ({ pageParam = 1 }) => (searchQuery ? searchMovies(searchQuery, pageParam) : fetchMovies(pageParam)),
    getNextPageParam: (lastPage, pages) => (lastPage.length === 20 ? pages.length + 1 : undefined),
    initialPageParam: 1,
  })

  const { data: featuredMovies, isLoading: featuredMoviesLoading } = useInfiniteQuery({
    queryKey: ["featuredMovies"],
    queryFn: () => fetchRandomPopularMovies(5),
    getNextPageParam: () => undefined,
  })

  const observer = useRef<IntersectionObserver>()
  const lastMovieElementRef = useCallback(
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

  useEffect(() => {
    if (data) {
      const newUniqueMovies = { ...uniqueMovies }
      let hasNewMovies = false
      data.pages.forEach((page) => {
        page.forEach((movie: any) => {
          if (!newUniqueMovies[movie.id]) {
            newUniqueMovies[movie.id] = true
            hasNewMovies = true
          }
        })
      })
      if (hasNewMovies) {
        setUniqueMovies(newUniqueMovies)
      }
    }
  }, [data, uniqueMovies])

  if (isLoading || featuredMoviesLoading) {
    return <LoadingSpinner />
  }

  if (status === "error")
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">Error fetching movies. Please try again later.</div>
    )

  const movies = data?.pages.flatMap((page) => page.filter((movie: any) => uniqueMovies[movie.id])) || []

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 py-8">
        {!searchQuery && !featuredMoviesLoading && featuredMovies && (
          <MovieSlider movies={featuredMovies.pages[0] || []} />
        )}
        {!searchQuery && user && <ContinueWatchingGrid mediaType="movie" />}
        <h2 className="text-2xl font-bold mb-4 mt-8 text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
        </h2>
        {movies.length > 0 ? (
          <MovieGrid movies={movies} lastMovieRef={lastMovieElementRef} />
        ) : (
          <p className="text-white">No results found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
        )}
      </div>
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  )
}

