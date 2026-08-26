import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { MealSlot, User, UserRecipeState } from '../types'

const USER_STORAGE_KEY = 'rr_user'
const FAVORITES_STORAGE_KEY = 'rr_favorites'
const PLANNED_STORAGE_KEY = 'rr_planned'
const BASKET_STORAGE_KEY = 'rr_basket'

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

  // Planning mode: toggled from the "Plan" nav item, turns the feed into a
  // recipe-picker that adds taps to the basket instead of opening detail.
  planningMode: boolean
  togglePlanningMode: () => void
  exitPlanningMode: () => void

  basketIds: string[]
  isInBasket: (recipeId: string) => boolean
  toggleBasketItem: (recipeId: string) => void
  removeFromBasket: (recipeId: string) => void

  // One active planned/made_it entry per recipe. Placing a recipe that
  // already has an entry moves it to the new date/slot.
  getPlannedEntry: (recipeId: string) => UserRecipeState | undefined
  getEntriesForCell: (plannedDate: string, mealSlot: MealSlot) => UserRecipeState[]
  placeRecipe: (recipeId: string, plannedDate: string, mealSlot: MealSlot) => void
  markMadeIt: (recipeId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadJSON(USER_STORAGE_KEY, null))
  const [favorites, setFavorites] = useState<UserRecipeState[]>(() =>
    loadJSON(FAVORITES_STORAGE_KEY, []),
  )
  const [planned, setPlanned] = useState<UserRecipeState[]>(() =>
    loadJSON(PLANNED_STORAGE_KEY, []),
  )
  const [basketIds, setBasketIds] = useState<string[]>(() => loadJSON(BASKET_STORAGE_KEY, []))
  const [planningMode, setPlanningMode] = useState(false)

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

  useEffect(() => {
    localStorage.setItem(PLANNED_STORAGE_KEY, JSON.stringify(planned))
  }, [planned])

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketIds))
  }, [basketIds])

  const login = () => setUser(STATIC_TEST_USER)
  const logout = () => setUser(null)

  const favoriteIds = useMemo(() => favorites.map((f) => f.recipeId), [favorites])
  const isFavorite = (recipeId: string) => favoriteIds.includes(recipeId)

  const toggleFavorite = (recipeId: string) => {
    if (!user) return
    setFavorites((prev) => {
      const exists = prev.some((f) => f.recipeId === recipeId)
      if (exists) return prev.filter((f) => f.recipeId !== recipeId)
      const entry: UserRecipeState = {
        userId: user.id,
        recipeId,
        status: 'fav',
        plannedDate: null,
        mealSlot: null,
      }
      return [...prev, entry]
    })
  }

  const togglePlanningMode = () => setPlanningMode((prev) => !prev)
  const exitPlanningMode = () => setPlanningMode(false)

  const isInBasket = (recipeId: string) => basketIds.includes(recipeId)

  const toggleBasketItem = (recipeId: string) => {
    setBasketIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId],
    )
  }

  const removeFromBasket = (recipeId: string) => {
    setBasketIds((prev) => prev.filter((id) => id !== recipeId))
  }

  const getPlannedEntry = (recipeId: string) => planned.find((p) => p.recipeId === recipeId)

  const getEntriesForCell = (plannedDate: string, mealSlot: MealSlot) =>
    planned.filter((p) => p.plannedDate === plannedDate && p.mealSlot === mealSlot)

  const placeRecipe = (recipeId: string, plannedDate: string, mealSlot: MealSlot) => {
    if (!user) return
    setPlanned((prev) => {
      const existing = prev.find((p) => p.recipeId === recipeId)
      const entry: UserRecipeState = {
        userId: user.id,
        recipeId,
        status: 'planned',
        plannedDate,
        mealSlot,
      }
      if (existing) return prev.map((p) => (p.recipeId === recipeId ? entry : p))
      return [...prev, entry]
    })
    removeFromBasket(recipeId)
  }

  const markMadeIt = (recipeId: string) => {
    setPlanned((prev) =>
      prev.map((p) => (p.recipeId === recipeId ? { ...p, status: 'made_it' } : p)),
    )
  }

  const value: AppContextValue = {
    user,
    login,
    logout,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    planningMode,
    togglePlanningMode,
    exitPlanningMode,
    basketIds,
    isInBasket,
    toggleBasketItem,
    removeFromBasket,
    getPlannedEntry,
    getEntriesForCell,
    placeRecipe,
    markMadeIt,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
