type WatchHistoryItem = {
  showId: string
  season: string
  episode: string
  progress: number
  timestamp: number
}

type UserWatchHistory = {
  [showId: string]: WatchHistoryItem
}

const WATCH_HISTORY_KEY = "sonix_watch_history"

export function getWatchHistory(userId: string, showId: string): WatchHistoryItem | null {
  const userHistory = getUserWatchHistory(userId)
  return userHistory[showId] || null
}

export function updateWatchHistory(
  userId: string,
  showId: string,
  season: string,
  episode: string,
  progress: number,
): void {
  const userHistory = getUserWatchHistory(userId)
  userHistory[showId] = {
    showId,
    season,
    episode,
    progress,
    timestamp: Date.now(),
  }
  saveUserWatchHistory(userId, userHistory)
}

function getUserWatchHistory(userId: string): UserWatchHistory {
  const storageKey = `${WATCH_HISTORY_KEY}_${userId}`
  const storedHistory = localStorage.getItem(storageKey)
  return storedHistory ? JSON.parse(storedHistory) : {}
}

function saveUserWatchHistory(userId: string, history: UserWatchHistory): void {
  const storageKey = `${WATCH_HISTORY_KEY}_${userId}`
  localStorage.setItem(storageKey, JSON.stringify(history))
}

