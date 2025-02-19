import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import Link from "next/link"

type Series = {
  id: number
  name: string
  poster_path: string | null
  vote_average: number
  first_air_date: string
}

type SeriesGridProps = {
  series: Series[]
  lastSeriesRef?: (node: HTMLDivElement) => void
}

export default function SeriesGrid({ series, lastSeriesRef }: SeriesGridProps) {
  const filteredSeries = series.filter((show) => show.poster_path !== null)

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {filteredSeries.map((show, index) => (
        <div key={show.id} ref={index === filteredSeries.length - 1 ? lastSeriesRef : undefined}>
          <Link href={`/tv-shows/${show.id}`}>
            <Card className="bg-sonix-black">
              <CardContent className="p-0">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </AspectRatio>
                <div className="p-2 sm:p-4">
                  <h3 className="font-semibold truncate text-white text-[10px] sm:text-xs md:text-sm">{show.name}</h3>
                  <div className="flex items-center justify-between text-[8px] sm:text-xs text-gray-400">
                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                    <span className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      {show.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}

