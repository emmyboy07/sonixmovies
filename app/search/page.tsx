"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import MovieGrid from "@/components/MovieGrid"
import { searchMovies } from "@/lib/api"
import LoadingSpinner from "@/components/LoadingSpinner"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setLoading(true)
        try {
          const results = await searchMovies(query)
          setMovies(results)
        } catch (error) {
          console.error("Error fetching search results:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchSearchResults()
  }, [query])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Search Results for "{query}"</h2>
      {movies.length > 0 ? <MovieGrid movies={movies} /> : <p className="text-white">No results found for "{query}"</p>}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  )
}

