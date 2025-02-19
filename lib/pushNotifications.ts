import { toast } from "sonner"

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    toast.error("Push notifications are not supported in this browser")
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // Send the subscription to your server
    await fetch("/api/push-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })

    toast.success("Successfully subscribed to push notifications")
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    toast.error("Failed to subscribe to push notifications")
  }
}

export async function unsubscribeFromPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    toast.error("Push notifications are not supported in this browser")
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      // Inform your server about the unsubscription
      await fetch("/api/push-subscription", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
      toast.success("Successfully unsubscribed from push notifications")
    }
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    toast.error("Failed to unsubscribe from push notifications")
  }
}

