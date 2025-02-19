import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  requestGeolocation,
  requestNotifications,
  requestMicrophoneAccess,
  checkStorageAccess,
} from "@/lib/permissions"

export function PermissionsManager() {
  const [permissions, setPermissions] = useState({
    geolocation: false,
    notifications: false,
    microphone: false,
    storage: false,
  })

  useEffect(() => {
    checkStorageAccess().then((result) => setPermissions((prev) => ({ ...prev, storage: result })))
  }, [])

  const handleGeolocationRequest = async () => {
    const result = await requestGeolocation()
    setPermissions((prev) => ({ ...prev, geolocation: result }))
    toast(result ? "Geolocation access granted" : "Geolocation access denied")
  }

  const handleNotificationsRequest = async () => {
    const result = await requestNotifications()
    setPermissions((prev) => ({ ...prev, notifications: result }))
    toast(result ? "Notification permission granted" : "Notification permission denied")
  }

  const handleMicrophoneRequest = async () => {
    const result = await requestMicrophoneAccess()
    setPermissions((prev) => ({ ...prev, microphone: result }))
    toast(result ? "Microphone access granted" : "Microphone access denied")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">App Permissions</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Geolocation:</span>
          <Button onClick={handleGeolocationRequest} disabled={permissions.geolocation}>
            {permissions.geolocation ? "Granted" : "Request"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Notifications:</span>
          <Button onClick={handleNotificationsRequest} disabled={permissions.notifications}>
            {permissions.notifications ? "Granted" : "Request"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Microphone (for voice search):</span>
          <Button onClick={handleMicrophoneRequest} disabled={permissions.microphone}>
            {permissions.microphone ? "Granted" : "Request"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Local Storage:</span>
          <span>{permissions.storage ? "Available" : "Not Available"}</span>
        </div>
      </div>
    </div>
  )
}

