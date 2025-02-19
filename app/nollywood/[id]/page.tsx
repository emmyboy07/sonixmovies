"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { fetchNollywoodVideoDetails } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import LoadingSpinner from "@/components/LoadingSpinner"

interface VideoDetails {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
  }
}

export default function NollywoodVideoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideoDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchNollywoodVideoDetails(id as string)

        if (!data || !data.id) {
          throw new Error("Invalid video data received")
        }

        setVideoDetails(data)
      } catch (error) {
        console.error("Error loading video details:", error)
        setError("Failed to load video. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    loadVideoDetails()
  }, [id])

  if (loading) {
    return <LoadingSpinner />
  }
  if (error) {
    return (
      <div className="min-h-screen bg-sonix-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push("/nollywood")}>
            Go back to Nollywood
          </Button>
        </div>
      </div>
    )
  }
  if (!videoDetails) {
    return (
      <div className="min-h-screen bg-sonix-black text-white flex items-center justify-center">Video not found</div>
    )
  }

  return (
    <div className="min-h-screen bg-sonix-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 mr-2" /> Back
        </Button>
        <div className="aspect-video w-full mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoDetails.id}?autoplay=1`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="rounded-lg"
          />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{videoDetails.snippet.title}</h1>
          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{videoDetails.snippet.description}</p>
          <p className="text-sm text-gray-400">
            Released {formatDistanceToNow(new Date(videoDetails.snippet.publishedAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}

