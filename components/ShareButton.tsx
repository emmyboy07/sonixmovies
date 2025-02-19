"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { ShareModal } from "./ShareModal"

interface ShareButtonProps {
  title: string
  description: string
  imageUrl: string
  url: string
  releaseDate?: string
  runtime?: string
  rating?: string
  categories?: string[]
  genre?: string
  currentSeason?: string
  currentEpisode?: string
  episodeInfo?: {
    name: string
    overview: string
  }
  shareEpisodeData: boolean
}

export function ShareButton({
  title,
  description,
  imageUrl,
  url,
  releaseDate,
  runtime,
  rating,
  categories,
  genre,
  currentSeason,
  currentEpisode,
  episodeInfo,
  shareEpisodeData,
}: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatShareText = (includeEpisodeData = false) => {
    if (includeEpisodeData && currentSeason && currentEpisode && episodeInfo) {
      return `🎬 Title: ${title}
🏷️ Category: ${categories?.join(", ") || "N/A"}
⏱️ Runtime: ${runtime || "N/A"} mins
🎭 Genre: ${genre || "N/A"}
📅 Release Date: ${releaseDate || "N/A"}
⭐ Rating: ${rating || "N/A"}
📺 Current: Season ${currentSeason}, Episode ${currentEpisode}

📝 Details: ${episodeInfo.overview.slice(0, 100)}...

🍿 Watch now on Sonix Movies: ${url}

#SonixMovies #TVShow`
    }

    return `🎬 Title: ${title}
🏷️ Category: ${categories?.join(", ") || "N/A"}
⏱️ Runtime: ${runtime || "N/A"} mins
🎭 Genre: ${genre || "N/A"}
📅 Release Date: ${releaseDate || "N/A"}
⭐ Rating: ${rating || "N/A"}

📝 Overview: ${description.slice(0, 150)}...

🍿 Watch now on Sonix Movies: ${url}

#SonixMovies #${currentSeason && currentEpisode ? "TVShow" : "MovieNight"}`
  }

  const shareContent = async () => {
    const shareText = formatShareText(shareEpisodeData && currentSeason && currentEpisode && episodeInfo)
    const shareData = {
      title: `Watch "${title}" on Sonix Movies`,
      text: shareText,
      url: url,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        // If Web Share API is not available, open the custom share modal
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Open the modal as a fallback if Web Share API fails
      setIsModalOpen(true)
    }
  }

  const handleShare = () => {
    shareContent()
  }

  return (
    <>
      <Button variant="ghost" className="flex flex-col items-center gap-2" onClick={handleShare}>
        <Share2 className="w-6 h-6 text-white" />
        <span className="text-sm text-white">Share Now</span>
      </Button>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        shareText={formatShareText(false)}
        url={url}
        imageUrl={imageUrl}
        onShare={(platform) => {
          toast.success(`Shared on ${platform}`)
          setIsModalOpen(false)
        }}
        hasEpisodeData={!!(currentSeason && currentEpisode && episodeInfo)}
        formatShareText={formatShareText}
      />
    </>
  )
}

