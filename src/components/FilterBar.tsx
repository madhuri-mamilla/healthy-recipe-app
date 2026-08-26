import type { Category, CookingMethod } from '../types'

export type DietMode = 'veg' | 'non-veg'

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'salad', label: 'Salad' },
  { value: 'roll', label: 'Roll' },
  { value: 'one-pot-rice', label: 'One-Pot Rice' },
  { value: 'marinade', label: 'Marinade' },
  { value: 'noodles-pasta', label: 'Noodles/Pasta' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
]

const METHODS: { value: CookingMethod | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'air-fryer', label: 'Air-Fryer' },
  { value: 'stovetop', label: 'Stovetop' },
  { value: 'one-pot', label: 'One-Pot' },
  { value: 'no-cook', label: 'No-Cook' },
  { value: 'oven', label: 'Oven' },
]

interface FilterBarProps {
  dietMode: DietMode
  onDietModeChange: (mode: DietMode) => void
  includeEgg: boolean
  onIncludeEggChange: (value: boolean) => void
  category: Category | 'all'
  onCategoryChange: (value: Category | 'all') => void
  method: CookingMethod | 'all'
  onMethodChange: (value: CookingMethod | 'all') => void
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            value === opt.value
              ? 'bg-accent border-accent text-ink'
              : 'bg-white border-ink/15 text-ink/60 hover:border-accent/60'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function FilterBar({
  dietMode,
  onDietModeChange,
  includeEgg,
  onIncludeEggChange,
  category,
  onCategoryChange,
  method,
  onMethodChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-full border border-ink/15 p-1 bg-white">
          {(['veg', 'non-veg'] as DietMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onDietModeChange(mode)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                dietMode === mode ? 'bg-accent text-ink' : 'text-ink/70'
              }`}
            >
              {mode === 'veg' ? 'Veg' : 'Non-veg'}
            </button>
          ))}
        </div>

        {dietMode === 'veg' && (
          <label className="flex items-center gap-2 text-sm text-ink/60">
            <input
              type="checkbox"
              checked={includeEgg}
              onChange={(e) => onIncludeEggChange(e.target.checked)}
              className="rounded accent-accent"
            />
            Include egg recipes
          </label>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5">Category</p>
        <PillGroup options={CATEGORIES} value={category} onChange={onCategoryChange} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5">Method</p>
        <PillGroup options={METHODS} value={method} onChange={onMethodChange} />
      </div>
    </div>
  )
}
