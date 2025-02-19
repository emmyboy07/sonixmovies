"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomSearchBar from "./CustomSearchBar"
import { useAuth } from "./AuthProvider"

type SearchHandlerProps = {
  currentPage: "home" | "tvShows" | "nollywood" | "other"
  onSearchComplete?: () => void
}

export default function SearchHandler({ currentPage, onSearchComplete }: SearchHandlerProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const { addToSearchHistory, getSearchHistory, removeFromSearchHistory } = useAuth() // Moved useAuth call to top level

  useEffect(() => {
    setRecentSearches(getSearchHistory())
  }, [getSearchHistory])

  const handleSearch = (query: string) => {
    if (query.trim() === "") return

    addToSearchHistory(query)
    setRecentSearches(getSearchHistory())

    switch (currentPage) {
      case "home":
        router.push(`/search?q=${encodeURIComponent(query)}`)
        break
      case "tvShows":
        router.push(`/tv-shows?search=${encodeURIComponent(query)}`)
        break
      case "nollywood":
        router.push(`/nollywood?search=${encodeURIComponent(query)}`)
        break
      default:
        router.push(`/search?q=${encodeURIComponent(query)}`)
    }

    // Call the onSearchComplete callback after search is performed
    onSearchComplete?.()
  }

  const handleRemoveSearchItem = (query: string) => {
    const updatedHistory = recentSearches.filter((item) => item !== query)
    setRecentSearches(updatedHistory)
    // Update the search history in the AuthProvider
    removeFromSearchHistory(query) // Using useAuth's removeFromSearchHistory directly
  }

  return (
    <CustomSearchBar
      onSearch={handleSearch}
      recentSearches={recentSearches}
      onRemoveSearchItem={handleRemoveSearchItem}
    />
  )
}

