import { useEffect, useState } from 'react'
import type { MealSlot } from '../types'
import { useApp } from '../context/AppContext'
import { addDays, toDateKey } from '../lib/date'
import { MEAL_SLOTS } from '../lib/mealSlots'

interface PlanThisPopupProps {
  recipeId: string
  recipeName: string
  onClose: () => void
}

export default function PlanThisPopup({ recipeId, recipeName, onClose }: PlanThisPopupProps) {
  const { addPlannedMeal } = useApp()
  const todayKey = toDateKey(new Date())
  const maxKey = toDateKey(addDays(new Date(), 6))

  const [date, setDate] = useState(todayKey)
  const [mealSlot, setMealSlot] = useState<MealSlot>('dinner')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleConfirm = () => {
    addPlannedMeal(recipeId, date, mealSlot)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-30 bg-ink/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Plan ${recipeName}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream w-full max-w-sm rounded-2xl border border-ink/10 shadow-lg p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Plan this</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink/40 hover:text-ink/70 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-ink/60 mt-1 mb-4 line-clamp-1">{recipeName}</p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={date}
          min={todayKey}
          max={maxKey}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm font-mono text-ink mb-4"
        />

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
          Meal
        </label>
        <div className="flex flex-wrap gap-2 mb-5">
          {MEAL_SLOTS.map((slot) => (
            <button
              key={slot.value}
              onClick={() => setMealSlot(slot.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                mealSlot === slot.value
                  ? 'bg-accent border-accent text-ink'
                  : 'bg-white border-ink/15 text-ink/60 hover:border-accent/60'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full text-sm font-semibold text-ink/60 border border-ink/15 hover:bg-ink/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-full text-sm font-semibold bg-accent text-ink hover:brightness-95 transition-[filter]"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  )
}
