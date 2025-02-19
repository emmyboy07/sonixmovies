"use client"

import { useAuth } from "@/components/AuthProvider"
import Settings from "@/components/Settings"

export default function SettingsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
        <p className="text-white">Please log in to access your settings.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
      <Settings />
    </div>
  )
}

