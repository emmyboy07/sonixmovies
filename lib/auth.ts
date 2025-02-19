export type WatchHistoryItem = {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
  timestamp: number
  season?: number
  episode?: number
}

export type FavoriteItem = {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
}

export type User = {
  id: string
  username: string
  email: string
  password: string
  profileImage?: string
  watchHistory: { [id: string]: WatchHistoryItem }
  favorites: FavoriteItem[]
  settings: {
    subtitlesLanguage: string
    videoQuality: string
    autoPlayTrailers: boolean
    darkMode: boolean
  }
  notificationPreferences: {
    receiveReminders: boolean
  }
  pushSubscription?: PushSubscription
}

interface PushSubscription {
  endpoint: string
  expirationTime?: number
  keys: {
    p256dh: string
    auth: string
  }
}

const USERS_STORAGE_KEY = "sonix_movies_users"
const CURRENT_USER_KEY = "sonix_movies_current_user"

export function getUsers(): User[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}

export function setUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function addUser(user: User): void {
  const users = getUsers()
  users.push(user)
  setUsers(users)
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.email === email)
}

export function updateUser(updatedUser: User): void {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === updatedUser.id)
  if (index !== -1) {
    users[index] = updatedUser
    setUsers(users)
  }
}

export function removeUser(id: string): void {
  const users = getUsers()
  const updatedUsers = users.filter((user) => user.id !== id)
  setUsers(updatedUsers)
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function getCurrentUser(): User | null {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY)
  return currentUser ? JSON.parse(currentUser) : null
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getAllUsers(): User[] {
  return getUsers()
}

