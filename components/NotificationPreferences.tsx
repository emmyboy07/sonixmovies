"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PushNotificationSubscriber } from "./PushNotificationSubscriber"

export function NotificationPreferences() {
  const { user, updateNotificationPreferences } = useAuth()
  const [receiveReminders, setReceiveReminders] = useState(user?.notificationPreferences?.receiveReminders || false)

  useEffect(() => {
    if (user) {
      setReceiveReminders(user.notificationPreferences?.receiveReminders || false)
    }
  }, [user])

  const handleToggle = async (checked: boolean) => {
    if (user) {
      await updateNotificationPreferences({ receiveReminders: checked })
      setReceiveReminders(checked)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="continue-watching-reminders" checked={receiveReminders} onCheckedChange={handleToggle} />
        <Label htmlFor="continue-watching-reminders">Receive reminders for Continue Watching</Label>
      </div>
      <PushNotificationSubscriber />
    </div>
  )
}

