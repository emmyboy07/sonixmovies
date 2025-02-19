type WatchHistoryItem = {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
  timestamp: number
  season?: number
  episode?: number
}

type UserData = {
  watchHistory: WatchHistoryItem[]
}

const USER_DATA_KEY = "sonix_movies_user_data"

export const getUserData = (): UserData => {
  const storedData = localStorage.getItem(USER_DATA_KEY)
  return storedData
    ? JSON.parse(storedData)
    : {
        watchHistory: [],
      }
}

export const updateUserData = (newData: Partial<UserData>) => {
  const currentData = getUserData()
  const updatedData = { ...currentData, ...newData }
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData))
}

export const addToWatchHistory = (item: WatchHistoryItem) => {
  const currentData = getUserData()
  const updatedWatchHistory = [
    item,
    ...currentData.watchHistory.filter((i) => !(i.id === item.id && i.type === item.type)),
  ].slice(0, 20)
  updateUserData({ watchHistory: updatedWatchHistory })
}

export const removeFromWatchHistory = (id: string, type: "movie" | "tv") => {
  const currentData = getUserData()
  const updatedWatchHistory = currentData.watchHistory.filter((item) => !(item.id === id && item.type === type))
  updateUserData({ watchHistory: updatedWatchHistory })
}

