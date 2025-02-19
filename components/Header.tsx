"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Film, Settings, User, Search, Info, FileText, Mail, LogIn, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import SearchHandler from "./SearchHandler"
import { useAuth } from "@/components/AuthProvider"
import UserSwitcher from "./UserSwitcher"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getCurrentPage = () => {
    if (pathname === "/") return "home"
    if (pathname.startsWith("/tv-shows")) return "tvShows"
    if (pathname.startsWith("/nollywood")) return "nollywood"
    return "other"
  }

  return (
    <header className="bg-sonix-black text-white p-0 fixed top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between sm:justify-start p-4 sm:p-6 h-[80px]">
        <Link href="/" className="flex items-center pl-0 m-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-sonix-red">Sonix Movies</h1>
        </Link>

        <div className="flex items-center space-x-4 ml-auto sm:ml-0">
          <Button
            variant="ghost"
            className="p-2 sm:p-3 hover:bg-transparent"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2 sm:p-3 hover:bg-transparent">
                <Menu className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-sonix-black">
              <SheetHeader>
                <SheetTitle className="text-white text-2xl">Menu</SheetTitle>
                <SheetDescription className="text-gray-400 text-lg">
                  Navigate through different sections of Sonix Movies.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] py-4">
                <nav className="flex flex-col space-y-4">
                  <Link href="/nollywood" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <Film className="h-14 w-14" />
                      <span>Nollywood</span>
                    </Button>
                  </Link>
                  <Link href="/about" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <Info className="h-14 w-14" />
                      <span>About</span>
                    </Button>
                  </Link>
                  <Link href="/contact" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <Mail className="h-14 w-14" />
                      <span>Contact Us</span>
                    </Button>
                  </Link>
                  <Link href="/about-developer" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-14 w-14" />
                      <span>About Developer</span>
                    </Button>
                  </Link>
                  <Link href="/terms" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="h-14 w-14" />
                      <span>Terms & Privacy</span>
                    </Button>
                  </Link>
                  <Link href="/settings" passHref>
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent"
                      className="flex items-center justify-start space-x-3 text-white w-full p-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-14 w-14" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                  {user && user.id !== "anonymous" ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={user.profileImage || "/placeholder-user.jpg"}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.username}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <Link href="/profile" passHref>
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent"
                          className="flex items-center justify-start space-x-3 text-white w-full p-4"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-14 w-14" />
                          <span>Profile</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent"
                        className="flex items-center justify-start space-x-3 text-white w-full p-4"
                        onClick={() => {
                          setIsOpen(false)
                          logout()
                          router.push("/")
                        }}
                      >
                        <LogOut className="h-14 w-14" />
                        <span>Log Out</span>
                      </Button>
                      <UserSwitcher />
                    </>
                  ) : (
                    <Link href="/login" passHref>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent"
                        className="flex items-center justify-start space-x-3 text-white w-full p-4"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-14 w-14" />
                        <span>Log In</span>
                      </Button>
                    </Link>
                  )}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isSearchOpen && (
        <div className="bg-sonix-black text-white p-4">
          <SearchHandler currentPage={getCurrentPage()} onSearchComplete={() => setIsSearchOpen(false)} />
        </div>
      )}
    </header>
  )
}

