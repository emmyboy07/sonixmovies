"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock, X } from "lucide-react"
import VoiceSearch from "./VoiceSearch"
import type React from "react" // Added import for React

interface CustomSearchBarProps {
  onSearch: (query: string) => void
  recentSearches: string[]
  onRemoveSearchItem: (query: string) => void
}

export default function CustomSearchBar({ onSearch, recentSearches, onRemoveSearchItem }: CustomSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setIsDropdownOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsDropdownOpen(true)
  }

  const handleVoiceResult = (result: string) => {
    setSearchQuery(result)
    onSearch(result)
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    onSearch(search)
    setIsDropdownOpen(false)
  }

  const handleRemoveSearchItem = (e: React.MouseEvent, search: string) => {
    e.stopPropagation()
    onRemoveSearchItem(search)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          className="flex-grow rounded-r-none bg-gray-800 text-white border-gray-700 text-base"
          style={{ fontSize: "16px" }}
        />
        <Button type="submit" className="rounded-l-none bg-sonix-red">
          <Search className="h-4 w-4" />
        </Button>
        <VoiceSearch onResult={handleVoiceResult} />
      </form>

      {isDropdownOpen && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1">
          <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Searches</h3>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1 px-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleRecentSearchClick(search)}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{search}</span>
                </div>
                <X
                  className="h-4 w-4 text-gray-400 hover:text-white"
                  onClick={(e) => handleRemoveSearchItem(e, search)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

