import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

type Video = {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
}

type YouTubeVideoGridProps = {
  videos: Video[]
  lastVideoRef?: (node: HTMLDivElement) => void
}

export default function YouTubeVideoGrid({ videos, lastVideoRef }: YouTubeVideoGridProps) {
  if (!videos || videos.length === 0) {
    return <p className="text-white">No videos available.</p>
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {videos.map((video, index) => (
        <Link href={`/nollywood/${video?.id || ""}`} key={video?.id || index}>
          <Card
            className="bg-sonix-black cursor-pointer transition-transform duration-200 hover:scale-105"
            ref={index === videos.length - 1 ? lastVideoRef : undefined}
          >
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={video?.thumbnail || "/placeholder.svg"}
                  alt={video?.title || "Video thumbnail"}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </AspectRatio>
              <div className="p-2 sm:p-4">
                <h3 className="font-semibold truncate text-white text-[10px] sm:text-xs md:text-sm">
                  {video?.title || "Untitled Video"}
                </h3>
                <div className="flex items-center text-[8px] sm:text-xs text-gray-400">
                  <span>
                    {video?.publishedAt
                      ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })
                      : "Date unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

