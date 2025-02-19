import type { User } from "./auth"

// This is a mock database. In a real application, you'd use a proper database.
const subscriptions: { [userId: string]: PushSubscription[] } = {}

export async function addSubscription(userId: string, subscription: PushSubscription) {
  if (!subscriptions[userId]) {
    subscriptions[userId] = []
  }
  subscriptions[userId].push(subscription)
}

export async function removeSubscription(userId: string, subscription: PushSubscription) {
  if (subscriptions[userId]) {
    subscriptions[userId] = subscriptions[userId].filter((sub) => sub.endpoint !== subscription.endpoint)
  }
}

export async function getSubscriptions(userId: string): Promise<PushSubscription[]> {
  return subscriptions[userId] || []
}

export async function sendNotification(user: User, message: string) {
  const userSubscriptions = await getSubscriptions(user.id)

  for (const subscription of userSubscriptions) {
    try {
      await fetch(subscription.endpoint, {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VAPID_PRIVATE_KEY}`,
        },
      })
    } catch (error) {
      console.error("Error sending push notification:", error)
    }
  }
}

