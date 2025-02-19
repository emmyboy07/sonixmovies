"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  const { user, updateUser, updateNotificationPreferences } = useAuth()
  const [subtitlesLanguage, setSubtitlesLanguage] = useState(user?.settings?.subtitlesLanguage || "english")
  const [videoQuality, setVideoQuality] = useState(user?.settings?.videoQuality || "auto")
  const [autoPlayTrailers, setAutoPlayTrailers] = useState(user?.settings?.autoPlayTrailers || false)
  const [receiveReminders, setReceiveReminders] = useState(user?.notificationPreferences?.receiveReminders || false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setSubtitlesLanguage(user.settings?.subtitlesLanguage || "english")
      setVideoQuality(user.settings?.videoQuality || "auto")
      setAutoPlayTrailers(user?.settings?.autoPlayTrailers || false)
      setReceiveReminders(user.notificationPreferences?.receiveReminders || false)
    }
  }, [user])

  const saveSettings = async () => {
    if (!user) return
    setIsSaving(true)
    const settings = {
      subtitlesLanguage,
      videoQuality,
      autoPlayTrailers,
    }
    try {
      await updateUser({ settings })
      await updateNotificationPreferences({ receiveReminders })
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Playback Settings</h2>
        <div className="space-y-2">
          <Label htmlFor="subtitles-language">Subtitles Language</Label>
          <Select value={subtitlesLanguage} onValueChange={setSubtitlesLanguage}>
            <SelectTrigger id="subtitles-language">
              <SelectValue placeholder="Select subtitles language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="off">Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-quality">Video Quality</Label>
          <Select value={videoQuality} onValueChange={setVideoQuality}>
            <SelectTrigger id="video-quality">
              <SelectValue placeholder="Select video quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="low">Low (480p)</SelectItem>
              <SelectItem value="medium">Medium (720p)</SelectItem>
              <SelectItem value="high">High (1080p)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-play-trailers">Auto-play Trailers</Label>
          <Switch id="auto-play-trailers" checked={autoPlayTrailers} onCheckedChange={setAutoPlayTrailers} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Notification Settings</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="continue-watching-reminders">Receive "Continue Watching" Reminders</Label>
          <Switch id="continue-watching-reminders" checked={receiveReminders} onCheckedChange={setReceiveReminders} />
        </div>
      </div>

      <Button onClick={saveSettings} className="w-full" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </div>
  )
}

