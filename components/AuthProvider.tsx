"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  type User,
  addUser,
  getUserByEmail,
  updateUser as updateStoredUser,
  setCurrentUser as setStoredCurrentUser,
  clearCurrentUser,
} from "@/lib/auth"
import type { WatchHistoryItem } from "@/lib/auth"
import { toast } from "sonner"

type FavoriteItem = {
  id: string
  title: string
  poster_path: string
  type: "movie" | "tv"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  addToWatchHistory: (item: WatchHistoryItem) => void
  updateSettings: (settings: Partial<User["settings"]>) => Promise<void>
  switchUser: (email: string, password: string) => Promise<void>
  addToSearchHistory: (query: string) => void
  getSearchHistory: () => string[]
  clearSearchHistory: () => void
  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  removeFromSearchHistory: (query: string) => void
  updateNotificationPreferences: (preferences: { receiveReminders: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SEARCH_HISTORY_KEY = "search_history"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setFavorites(parsedUser.favorites || [])
    } else {
      setUser(null)
      setFavorites([])
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const foundUser = getUserByEmail(email)
      if (foundUser && foundUser.password === password) {
        setUser(foundUser)
        setFavorites(foundUser.favorites || [])
        setStoredCurrentUser(foundUser)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))
        localStorage.removeItem(SEARCH_HISTORY_KEY)
        toast.success(`Welcome back, ${foundUser.username}!`)
        localStorage.setItem("showGreeting", "true")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast.error("Login failed. Please check your email and password.")
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      if (getUserByEmail(email)) {
        throw new Error("Email already in use")
      }
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        watchHistory: {},
        favorites: [],
        settings: {
          subtitlesLanguage: "english",
          videoQuality: "auto",
          autoPlayTrailers: false,
          darkMode: false,
        },
        notificationPreferences: {
          continueWatching: false,
        },
      }
      addUser(newUser)
      setUser(newUser)
      setFavorites([])
      setStoredCurrentUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      localStorage.removeItem(SEARCH_HISTORY_KEY)
      toast.success(`Welcome to Sonix Movies, ${username}!`)
      localStorage.setItem("showGreeting", "true")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
      throw error
    }
  }

  const logout = () => {
    clearCurrentUser()
    localStorage.removeItem("currentUser")
    localStorage.removeItem(SEARCH_HISTORY_KEY)
    localStorage.removeItem("showGreeting")
    setUser(null)
    setFavorites([])
    toast.info("You have been logged out.")
    router.push("/")
  }

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      if (user.id !== "anonymous") {
        updateStoredUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      } else {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
      setUser(updatedUser)
      setFavorites(updatedUser.favorites || [])
    } else {
      throw new Error("No user logged in")
    }
  }

  const addToWatchHistory = (item: WatchHistoryItem) => {
    if (user) {
      const updatedWatchHistory = {
        ...user.watchHistory,
        [item.id]: item,
      }
      const updatedUser = {
        ...user,
        watchHistory: updatedWatchHistory,
      }
      setUser(updatedUser)
      updateStoredUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const updateSettings = async (settings: Partial<User["settings"]>) => {
    if (user) {
      const updatedSettings = { ...user.settings, ...settings }
      const updatedUser = {
        ...user,
        settings: updatedSettings,
      }
      updateUser(updatedUser)
    }
  }

  const switchUser = async (email: string, password: string) => {
    await logout()
    await login(email, password)
  }

  const addToSearchHistory = (query: string) => {
    const searchHistory = getSearchHistory()
    const updatedHistory = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 10)
    localStorage.setItem(`${user?.id}_${SEARCH_HISTORY_KEY}`, JSON.stringify(updatedHistory))
  }

  const getSearchHistory = (): string[] => {
    const storedHistory = localStorage.getItem(`${user?.id}_${SEARCH_HISTORY_KEY}`)
    return storedHistory ? JSON.parse(storedHistory) : []
  }

  const removeFromSearchHistory = (query: string) => {
    if (user) {
      const searchHistory = getSearchHistory()
      const updatedHistory = searchHistory.filter((item) => item !== query)
      localStorage.setItem(`${user.id}_${SEARCH_HISTORY_KEY}`, JSON.stringify(updatedHistory))
    }
  }

  const clearSearchHistory = () => {
    localStorage.removeItem(`${user?.id}_${SEARCH_HISTORY_KEY}`)
  }

  const addFavorite = (item: FavoriteItem) => {
    if (user) {
      const updatedFavorites = [...favorites, item]
      setFavorites(updatedFavorites)
      const updatedUser = { ...user, favorites: updatedFavorites }
      updateUser(updatedUser)
    }
  }

  const removeFavorite = (id: string) => {
    if (user) {
      const updatedFavorites = favorites.filter((item) => item.id !== id)
      setFavorites(updatedFavorites)
      const updatedUser = { ...user, favorites: updatedFavorites }
      updateUser(updatedUser)
    }
  }

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("No user logged in")
    }

    if (user.password !== currentPassword) {
      throw new Error("Current password is incorrect")
    }

    const updatedUser = { ...user, password: newPassword }
    await updateUser(updatedUser)
    toast.success("Password changed successfully")
  }

  const updateNotificationPreferences = async (preferences: { receiveReminders: boolean }) => {
    if (user) {
      const updatedUser = {
        ...user,
        notificationPreferences: {
          ...user.notificationPreferences,
          ...preferences,
        },
      }
      await updateUser(updatedUser)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        addToWatchHistory,
        updateSettings,
        switchUser,
        addToSearchHistory,
        getSearchHistory,
        clearSearchHistory,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        changePassword,
        removeFromSearchHistory,
        updateNotificationPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

