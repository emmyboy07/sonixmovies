"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NetworkStatusNotification() {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showNotification) return null

  return (
    <Alert
      variant={isOnline ? "default" : "destructive"}
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-50 transition-opacity duration-300 ${
        showNotification ? "opacity-100" : "opacity-0"
      }`}
    >
      {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      <AlertTitle>{isOnline ? "Connection Restored" : "Network Issue"}</AlertTitle>
      <AlertDescription>
        {isOnline
          ? "Your internet connection has been restored."
          : "You are currently offline. Please check your internet connection."}
      </AlertDescription>
    </Alert>
  )
}

