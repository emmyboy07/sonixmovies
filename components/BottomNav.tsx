"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tv, Heart } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sonix-black border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 ${pathname === "/" ? "text-sonix-red" : "text-gray-400"} hover:bg-transparent`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/tv-shows"
          className={`flex flex-col items-center space-y-1 ${pathname.startsWith("/tv-shows") ? "text-sonix-red" : "text-gray-400"} hover:bg-transparent`}
        >
          <Tv className="h-6 w-6" />
          <span className="text-xs">TV Shows</span>
        </Link>
        <Link
          href="/favorites"
          className={`flex flex-col items-center space-y-1 ${pathname === "/favorites" ? "text-sonix-red" : "text-gray-400"} hover:bg-transparent`}
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs">Favorites</span>
        </Link>
      </div>
    </nav>
  )
}

