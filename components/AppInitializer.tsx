"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import SplashScreen from "./SplashScreen"
import { registerServiceWorker } from "@/lib/pwa-utils"
import type React from "react"

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const hasLaunched = localStorage.getItem("app_launched")

    const initializeApp = async () => {
      // Register service worker
      await registerServiceWorker()

      // Simulate other app initialization tasks
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.setItem("app_launched", "true")
          resolve()
        }, 3000)
      })
    }

    if (!hasLaunched || pathname === "/") {
      initializeApp().then(() => {
        setIsInitializing(false)
      })
    } else {
      setIsInitializing(false)
    }
  }, [pathname])

  if (isInitializing) {
    return <SplashScreen />
  }

  return <>{children}</>
}

