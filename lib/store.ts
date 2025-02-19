import { create } from "zustand"
import { persist } from "zustand/middleware"

type FavoriteItem = {
  id: string
  title: string
  type: "movie" | "tv"
  poster_path: string
}

interface FavoriteStore {
  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites.filter((f) => f.id !== item.id), item],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        })),
      isFavorite: (id) => get().favorites.some((item) => item.id === id),
      toggleFavorite: (item) =>
        set((state) => {
          const isFavorite = state.favorites.some((f) => f.id === item.id)
          if (isFavorite) {
            return { favorites: state.favorites.filter((f) => f.id !== item.id) }
          } else {
            return { favorites: [...state.favorites, item] }
          }
        }),
    }),
    {
      name: "favorite-storage",
    },
  ),
)

