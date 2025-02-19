"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { toast } from "sonner"

export function PushNotificationSubscriber() {
  const { user, updateUser } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    setIsSubscribed(!!user?.pushSubscription)
  }, [user])

  const subscribeToPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          subscription,
        }),
      })

      if (response.ok) {
        await updateUser({ pushSubscription: subscription })
        setIsSubscribed(true)
        toast.success("Successfully subscribed to push notifications")
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      toast.error("Failed to subscribe to push notifications")
    }
  }

  const unsubscribeFromPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }

      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      })

      if (response.ok) {
        await updateUser({ pushSubscription: null })
        setIsSubscribed(false)
        toast.success("Successfully unsubscribed from push notifications")
      } else {
        throw new Error("Failed to unsubscribe")
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      toast.error("Failed to unsubscribe from push notifications")
    }
  }

  return (
    <div>
      {isSubscribed ? (
        <Button onClick={unsubscribeFromPushNotifications}>Unsubscribe from Push Notifications</Button>
      ) : (
        <Button onClick={subscribeToPushNotifications}>Subscribe to Push Notifications</Button>
      )}
    </div>
  )
}

