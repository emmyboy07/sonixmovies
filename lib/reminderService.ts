import type { User } from "./auth"
import webpush from "web-push"

export async function generateContinueWatchingReminders(user: User): Promise<string | null> {
  if (!user.notificationPreferences?.receiveReminders) {
    return null
  }

  const unwatchedEpisodes = Object.values(user.watchHistory).filter(
    (item) => item.type === "tv" && Date.now() - item.timestamp > 7 * 24 * 60 * 60 * 1000, // 7 days
  )

  if (unwatchedEpisodes.length > 0) {
    const showNames = unwatchedEpisodes.map((item) => `${item.title} (S${item.season} E${item.episode})`).join(", ")
    return `Continue watching: ${showNames}. Pick up where you left off!`
  }

  return null
}

export async function sendPushNotification(user: User, message: string) {
  if (!user.pushSubscription) {
    console.log(`No push subscription for user ${user.id}`)
    return
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("VAPID keys are not set")
    return
  }

  webpush.setVapidDetails("mailto:your-email@example.com", vapidPublicKey, vapidPrivateKey)

  try {
    await webpush.sendNotification(user.pushSubscription, message)
    console.log(`Push notification sent to user ${user.id}`)
  } catch (error) {
    console.error(`Error sending push notification to user ${user.id}:`, error)
  }
}

export async function checkAndSendReminders(users: User[]) {
  for (const user of users) {
    const reminder = await generateContinueWatchingReminders(user)
    if (reminder) {
      await sendPushNotification(user, reminder)
    }
  }
}

