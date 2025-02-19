"use client"

import { useRef, useCallback, Suspense } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchNollywoodYouTubeVideos, searchNollywoodVideos } from "@/lib/api"
import YouTubeVideoGrid from "@/components/YouTubeVideoGrid"
import { useSearchParams } from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner"

function NollywoodContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["nollywoodVideos", searchQuery],
    queryFn: ({ pageParam }) =>
      searchQuery
        ? searchNollywoodVideos(searchQuery, 50, pageParam, true)
        : fetchNollywoodYouTubeVideos(50, pageParam, true),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  })

  const observer = useRef<IntersectionObserver>()
  const lastVideoElementRef = useCallback(
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

  if (status === "loading") return <LoadingSpinner />
  if (status === "error")
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Error fetching Nollywood videos. Please try again later.
      </div>
    )

  const videos = data?.pages.flatMap((page) => page.items) || []

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Nollywood Movies"}
        </h2>
        {videos.length > 0 ? (
          <YouTubeVideoGrid videos={videos} lastVideoRef={lastVideoElementRef} />
        ) : (
          <p className="text-white">No results found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
        )}
      </div>
      {isFetchingNextPage && (
        <div className="flex justify-center items-center mt-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default function NollywoodPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NollywoodContent />
    </Suspense>
  )
}

