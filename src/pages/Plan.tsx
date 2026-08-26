import { Fragment, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import recipesData from '../data/recipes.json'
import type { MealSlot, Recipe } from '../types'
import { useApp } from '../context/AppContext'
import { addDays, formatDayLabel, toDateKey } from '../lib/date'

const recipes = recipesData as Recipe[]
const recipeById = new Map(recipes.map((r) => [r.id, r]))

const MEAL_SLOTS: { value: MealSlot; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export default function Plan() {
  const {
    basketGroups,
    decrementBasketItem,
    getEntriesForCell,
    placeRecipe,
    markMadeIt,
    removePlannedMeal,
    plannedMeals,
    enterPlanningMode,
  } = useApp()
  const navigate = useNavigate()
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)

  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => addDays(today, i))
  }, [])

  const todayKey = toDateKey(new Date())

  // Clear the selection if its last unplaced instance just got placed/removed.
  const selectedStillAvailable = basketGroups.some((g) => g.recipeId === selectedRecipeId)
  const activeSelection = selectedStillAvailable ? selectedRecipeId : null

  const handleCellClick = (dateKey: string, slot: MealSlot) => {
    if (!activeSelection) return
    placeRecipe(activeSelection, dateKey, slot)
    setSelectedRecipeId(null)
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="font-display text-2xl font-semibold text-ink">Your Plan</h1>
        <button
          onClick={() => {
            enterPlanningMode()
            navigate('/feed')
          }}
          className="shrink-0 px-4 py-2 rounded-full bg-accent text-ink text-sm font-semibold hover:brightness-95 transition-[filter]"
        >
          Add recipes
        </button>
      </div>
      <p className="text-ink/60 mb-6">
        This week's calendar. Come back anytime — it'll look the same as you left it.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
            Unplaced
          </h2>
          {basketGroups.length === 0 ? (
            <p className="text-sm text-ink/40">
              Nothing waiting to be placed.{' '}
              {plannedMeals.length === 0 && (
                <>Tap <span className="text-ink/60 font-medium">Add recipes</span> to get started.</>
              )}
            </p>
          ) : (
            <ul className="space-y-2">
              {basketGroups.map(({ recipeId, count }) => {
                const recipe = recipeById.get(recipeId)
                if (!recipe) return null
                const isSelected = activeSelection === recipeId
                return (
                  <li key={recipeId}>
                    <div
                      onClick={() => setSelectedRecipeId(isSelected ? null : recipeId)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-colors ${
                        isSelected ? 'border-accent bg-accent-light/30' : 'border-ink/10 bg-white'
                      }`}
                    >
                      <span className="text-sm font-medium text-ink flex-1">{recipe.name}</span>
                      {count > 1 && (
                        <span className="text-xs font-mono font-semibold text-ink/60 bg-ink/5 rounded-full px-1.5 py-0.5">
                          ×{count}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          decrementBasketItem(recipeId)
                          if (isSelected && count <= 1) setSelectedRecipeId(null)
                        }}
                        aria-label={`Remove one ${recipe.name} from unplaced`}
                        className="text-ink/30 hover:text-ink/70 text-sm px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {activeSelection && (
            <p className="text-xs text-ink/70 font-medium mt-3">
              Now tap a day + meal on the calendar →
            </p>
          )}
        </aside>

        <div className="flex-1 overflow-x-auto">
          <div
            className="grid gap-2 min-w-[760px]"
            style={{ gridTemplateColumns: `96px repeat(${days.length}, minmax(96px, 1fr))` }}
          >
            <div />
            {days.map((day) => {
              const { weekday, day: dayNum } = formatDayLabel(day)
              const isToday = toDateKey(day) === todayKey
              return (
                <div
                  key={toDateKey(day)}
                  className={`text-center text-xs font-mono py-1.5 rounded-lg ${
                    isToday ? 'bg-accent text-ink font-semibold' : 'text-ink/60'
                  }`}
                >
                  <div className="uppercase">{weekday}</div>
                  <div>{dayNum}</div>
                </div>
              )
            })}

            {MEAL_SLOTS.map((slot) => (
              <Fragment key={slot.value}>
                <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {slot.label}
                </div>
                {days.map((day) => {
                  const dateKey = toDateKey(day)
                  const entries = getEntriesForCell(dateKey, slot.value)
                  return (
                    <div
                      key={`${dateKey}-${slot.value}`}
                      onClick={() => handleCellClick(dateKey, slot.value)}
                      className={`min-h-[64px] rounded-xl border border-dashed p-1.5 space-y-1 transition-colors ${
                        activeSelection
                          ? 'border-accent/60 hover:bg-accent-light/20 cursor-pointer'
                          : 'border-ink/10'
                      }`}
                    >
                      {entries.map((entry) => {
                        const recipe = recipeById.get(entry.recipeId)
                        if (!recipe) return null
                        return (
                          <div
                            key={entry.id}
                            className="bg-white border border-ink/10 rounded-lg px-2 py-1"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                to={`/recipe/${recipe.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-medium text-ink hover:underline line-clamp-1"
                              >
                                {recipe.name}
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removePlannedMeal(entry.id)
                                }}
                                aria-label={`Remove ${recipe.name} from this slot`}
                                className="text-ink/30 hover:text-ink/70 text-xs shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                            {entry.status === 'made_it' ? (
                              <span className="text-[10px] font-semibold text-veg">✓ Made it</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markMadeIt(entry.id)
                                }}
                                className="text-[10px] font-semibold text-ink/70 hover:text-ink hover:underline"
                              >
                                Mark made
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
