import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Movie = {
  id: string
  title: string
  poster_path: string
  backdrop_path: string
}

type NetflixRowProps = {
  title: string
  movies: Movie[]
}

export default function NetflixRow({ title, movies }: NetflixRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="netflix-row">
      <h2 className="netflix-row-title">{title}</h2>
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 opacity-0 transition group-hover:opacity-100"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div ref={rowRef} className="netflix-row-content">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="netflix-card">
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path || movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={169}
                className="rounded-md object-cover"
              />
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 opacity-0 transition group-hover:opacity-100"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

