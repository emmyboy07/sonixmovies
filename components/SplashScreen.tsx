"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-sonix-black">
      <div className="text-center px-4 w-full max-w-md">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sonix%20Movies-RmPG44SQLyyVfCaAoHxAD4zUEAqx8q.png"
            alt="Sonix Movies Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-sonix-red mb-2 sm:mb-4">Sonix Movies</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">Your Gateway to Unlimited Entertainment</p>
        <Progress value={progress} className="w-full mb-4 bg-gray-700 [&>div]:bg-sonix-red" />
        <p className="text-sm text-gray-400">Loading... {progress}%</p>
      </div>
    </div>
  )
}

