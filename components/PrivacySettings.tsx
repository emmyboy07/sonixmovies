"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/AuthProvider"
import { toast } from "sonner"

export default function PrivacySettings() {
  const { user, updateUser } = useAuth()
  const [clearWatchHistory, setClearWatchHistory] = useState(false)
  const [clearFavorites, setClearFavorites] = useState(false)

  const handleSave = async () => {
    if (!user) return

    const updatedUser = { ...user }

    if (clearWatchHistory) {
      updatedUser.watchHistory = []
    }

    if (clearFavorites) {
      updatedUser.favorites = []
    }

    try {
      await updateUser(updatedUser)
      toast.success("Privacy settings updated successfully")
    } catch (error) {
      toast.error("Failed to update privacy settings")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Privacy Settings</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="clear-watch-history">Clear Watch History</Label>
          <Switch id="clear-watch-history" checked={clearWatchHistory} onCheckedChange={setClearWatchHistory} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="clear-favorites">Clear Favorites</Label>
          <Switch id="clear-favorites" checked={clearFavorites} onCheckedChange={setClearFavorites} />
        </div>
      </div>
      <Button onClick={handleSave}>Save Privacy Settings</Button>
    </div>
  )
}

