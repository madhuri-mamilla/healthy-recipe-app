import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const { basketIds, removeFromBasket, getEntriesForCell, placeRecipe, markMadeIt } = useApp()
  const [selectedBasketId, setSelectedBasketId] = useState<string | null>(null)

  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => addDays(today, i))
  }, [])

  const todayKey = toDateKey(new Date())

  const handleCellClick = (dateKey: string, slot: MealSlot) => {
    if (!selectedBasketId) return
    placeRecipe(selectedBasketId, dateKey, slot)
    setSelectedBasketId(null)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Your Plan</h1>
      <p className="text-ink/60 mb-6">
        {basketIds.length > 0
          ? 'Tap a recipe below, then tap a day + meal to place it.'
          : 'Your placed meals for the week.'}
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Basket</h2>
          {basketIds.length === 0 ? (
            <p className="text-sm text-ink/40">
              Nothing to place.{' '}
              <Link to="/feed" className="underline text-ink/60 hover:text-ink">
                Go pick some recipes
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {basketIds.map((id) => {
                const recipe = recipeById.get(id)
                if (!recipe) return null
                const isSelected = selectedBasketId === id
                return (
                  <li key={id}>
                    <div
                      onClick={() => setSelectedBasketId(isSelected ? null : id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-colors ${
                        isSelected ? 'border-accent bg-accent-light/30' : 'border-ink/10 bg-white'
                      }`}
                    >
                      <span className="text-sm font-medium text-ink flex-1">{recipe.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromBasket(id)
                          if (isSelected) setSelectedBasketId(null)
                        }}
                        aria-label={`Remove ${recipe.name} from basket`}
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
          {selectedBasketId && (
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
                        selectedBasketId
                          ? 'border-accent/60 hover:bg-accent-light/20 cursor-pointer'
                          : 'border-ink/10'
                      }`}
                    >
                      {entries.map((entry) => {
                        const recipe = recipeById.get(entry.recipeId)
                        if (!recipe) return null
                        return (
                          <div
                            key={entry.recipeId}
                            className="bg-white border border-ink/10 rounded-lg px-2 py-1"
                          >
                            <Link
                              to={`/recipe/${recipe.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block text-xs font-medium text-ink hover:underline line-clamp-1"
                            >
                              {recipe.name}
                            </Link>
                            {entry.status === 'made_it' ? (
                              <span className="text-[10px] font-semibold text-veg">✓ Made it</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markMadeIt(entry.recipeId)
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
