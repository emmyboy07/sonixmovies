"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { subscribeToPushNotifications, unsubscribeFromPushNotifications } from "@/lib/pushNotifications"

export function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription)
        })
      })
    }
  }, [])

  const handleClick = async () => {
    if (isSubscribed) {
      await unsubscribeFromPushNotifications()
    } else {
      await subscribeToPushNotifications()
    }
    // Update subscription state after action
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    }
  }

  return (
    <Button onClick={handleClick}>
      {isSubscribed ? "Unsubscribe from Push Notifications" : "Subscribe to Push Notifications"}
    </Button>
  )
}

