import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { MealSlot, PlannedMeal, User } from '../types'

const USER_STORAGE_KEY = 'rr_user'
const FAVORITES_STORAGE_KEY = 'rr_favorites'
const PLANNED_MEALS_STORAGE_KEY = 'rr_planned_meals'
const BASKET_STORAGE_KEY = 'rr_basket'

const STATIC_TEST_USER: User = {
  id: 'test-user-1',
  name: 'Test User',
  authProvider: 'placeholder',
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `pm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

interface AppContextValue {
  user: User | null
  login: () => void
  logout: () => void

  favoriteIds: string[]
  isFavorite: (recipeId: string) => boolean
  toggleFavorite: (recipeId: string) => void

  // Planning mode: entered via the Plan screen's "Add recipes" button, turns
  // the feed into a recipe-picker (stepper cards) instead of a browse list.
  planningMode: boolean
  enterPlanningMode: () => void
  exitPlanningMode: () => void

  // Basket is a multiset of recipeIds: a recipe can appear more than once,
  // one entry per not-yet-placed instance. Once placed, an instance becomes
  // a PlannedMeal and leaves the basket.
  basketTotal: number
  basketGroups: { recipeId: string; count: number }[]
  basketCount: (recipeId: string) => number
  incrementBasketItem: (recipeId: string) => void
  decrementBasketItem: (recipeId: string) => void

  plannedMeals: PlannedMeal[]
  getPlannedMealsForRecipe: (recipeId: string) => PlannedMeal[]
  getEntriesForCell: (date: string, mealSlot: MealSlot) => PlannedMeal[]
  placeRecipe: (recipeId: string, date: string, mealSlot: MealSlot) => void
  /** Quick-add: creates a PlannedMeal directly, bypassing the basket entirely. */
  addPlannedMeal: (recipeId: string, date: string, mealSlot: MealSlot) => void
  markMadeIt: (plannedMealId: string) => void
  removePlannedMeal: (plannedMealId: string) => void
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

/** Tolerates the pre-2.1 favorites shape (an array of {recipeId, ...} rows). */
function loadFavoriteIds(): string[] {
  const raw = loadJSON<unknown[]>(FAVORITES_STORAGE_KEY, [])
  return raw.map((item) =>
    typeof item === 'string' ? item : (item as { recipeId: string }).recipeId,
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadJSON(USER_STORAGE_KEY, null))
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavoriteIds)
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() =>
    loadJSON(PLANNED_MEALS_STORAGE_KEY, []),
  )
  const [basket, setBasket] = useState<string[]>(() => loadJSON(BASKET_STORAGE_KEY, []))
  const [planningMode, setPlanningMode] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    localStorage.setItem(PLANNED_MEALS_STORAGE_KEY, JSON.stringify(plannedMeals))
  }, [plannedMeals])

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket))
  }, [basket])

  const login = () => setUser(STATIC_TEST_USER)
  const logout = () => setUser(null)

  const isFavorite = (recipeId: string) => favoriteIds.includes(recipeId)

  const toggleFavorite = (recipeId: string) => {
    if (!user) return
    setFavoriteIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId],
    )
  }

  const enterPlanningMode = () => setPlanningMode(true)
  const exitPlanningMode = () => setPlanningMode(false)

  const basketCount = (recipeId: string) => basket.filter((id) => id === recipeId).length

  const basketGroups = useMemo(() => {
    const counts = new Map<string, number>()
    for (const id of basket) counts.set(id, (counts.get(id) ?? 0) + 1)
    return Array.from(counts, ([recipeId, count]) => ({ recipeId, count }))
  }, [basket])

  const incrementBasketItem = (recipeId: string) => setBasket((prev) => [...prev, recipeId])

  const decrementBasketItem = (recipeId: string) => {
    setBasket((prev) => {
      const index = prev.lastIndexOf(recipeId)
      if (index === -1) return prev
      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })
  }

  const getPlannedMealsForRecipe = (recipeId: string) =>
    plannedMeals.filter((p) => p.recipeId === recipeId)

  const getEntriesForCell = (date: string, mealSlot: MealSlot) =>
    plannedMeals.filter((p) => p.date === date && p.mealSlot === mealSlot)

  const createPlannedMeal = (recipeId: string, date: string, mealSlot: MealSlot) => {
    const entry: PlannedMeal = { id: generateId(), recipeId, date, mealSlot, status: 'planned' }
    setPlannedMeals((prev) => [...prev, entry])
  }

  const placeRecipe = (recipeId: string, date: string, mealSlot: MealSlot) => {
    if (!user || basketCount(recipeId) === 0) return
    createPlannedMeal(recipeId, date, mealSlot)
    decrementBasketItem(recipeId)
  }

  const addPlannedMeal = (recipeId: string, date: string, mealSlot: MealSlot) => {
    if (!user) return
    createPlannedMeal(recipeId, date, mealSlot)
  }

  const markMadeIt = (plannedMealId: string) => {
    setPlannedMeals((prev) =>
      prev.map((p) => (p.id === plannedMealId ? { ...p, status: 'made_it' } : p)),
    )
  }

  const removePlannedMeal = (plannedMealId: string) => {
    setPlannedMeals((prev) => prev.filter((p) => p.id !== plannedMealId))
  }

  const basketTotal = basket.length

  const value: AppContextValue = {
    user,
    login,
    logout,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    planningMode,
    enterPlanningMode,
    exitPlanningMode,
    basketTotal,
    basketGroups,
    basketCount,
    incrementBasketItem,
    decrementBasketItem,
    plannedMeals,
    getPlannedMealsForRecipe,
    getEntriesForCell,
    placeRecipe,
    addPlannedMeal,
    markMadeIt,
    removePlannedMeal,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
