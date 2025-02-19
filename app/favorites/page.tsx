"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function FavoritesPage() {
  const { user, favorites, removeFavorite } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((favorite) => (
            <div key={`${favorite.type}-${favorite.id}`} className="relative">
              <Link href={favorite.type === "movie" ? `/movie/${favorite.id}` : `/tv-shows/${favorite.id}`}>
                <Card className="bg-sonix-black transition-transform duration-200 hover:scale-105">
                  <CardContent className="p-0">
                    <AspectRatio ratio={2 / 3}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
                        alt={favorite.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </AspectRatio>
                    <div className="p-2">
                      <h3 className="font-semibold truncate text-white text-sm">{favorite.title}</h3>
                      <p className="text-xs text-gray-400">{favorite.type === "movie" ? "Movie" : "TV Show"}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

