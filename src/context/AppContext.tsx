import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User, UserRecipeState } from '../types'

const USER_STORAGE_KEY = 'rr_user'
const FAVORITES_STORAGE_KEY = 'rr_favorites'

const STATIC_TEST_USER: User = {
  id: 'test-user-1',
  name: 'Test User',
  authProvider: 'placeholder',
}

interface AppContextValue {
  user: User | null
  login: () => void
  logout: () => void
  favoriteIds: string[]
  isFavorite: (recipeId: string) => boolean
  toggleFavorite: (recipeId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function loadFavorites(): UserRecipeState[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserRecipeState[]) : []
  } catch {
    return []
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)
  const [favorites, setFavorites] = useState<UserRecipeState[]>(loadFavorites)

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const login = () => setUser(STATIC_TEST_USER)
  const logout = () => setUser(null)

  const favoriteIds = useMemo(() => favorites.map((f) => f.recipeId), [favorites])

  const isFavorite = (recipeId: string) => favoriteIds.includes(recipeId)

  const toggleFavorite = (recipeId: string) => {
    if (!user) return
    setFavorites((prev) => {
      const exists = prev.some((f) => f.recipeId === recipeId)
      if (exists) {
        return prev.filter((f) => f.recipeId !== recipeId)
      }
      const entry: UserRecipeState = {
        userId: user.id,
        recipeId,
        status: 'fav',
        plannedDate: null,
      }
      return [...prev, entry]
    })
  }

  const value: AppContextValue = {
    user,
    login,
    logout,
    favoriteIds,
    isFavorite,
    toggleFavorite,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
