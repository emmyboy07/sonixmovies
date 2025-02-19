"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { type User, getCurrentUser, clearCurrentUser } from "@/lib/auth"

type AppInstanceContextType = {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  clearInstance: () => void
}

const AppInstanceContext = createContext<AppInstanceContextType | undefined>(undefined)

export const AppInstanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const clearInstance = () => {
    clearCurrentUser()
    setCurrentUser(null)
  }

  return (
    <AppInstanceContext.Provider value={{ currentUser, setCurrentUser, clearInstance }}>
      {children}
    </AppInstanceContext.Provider>
  )
}

export const useAppInstance = () => {
  const context = useContext(AppInstanceContext)
  if (context === undefined) {
    throw new Error("useAppInstance must be used within an AppInstanceProvider")
  }
  return context
}

