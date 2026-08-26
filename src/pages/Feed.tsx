import { useMemo, useState } from 'react'
import recipesData from '../data/recipes.json'
import type { Category, CookingMethod, Recipe } from '../types'
import FilterBar, { type DietMode } from '../components/FilterBar'
import RecipeCard from '../components/RecipeCard'
import { useApp } from '../context/AppContext'

const recipes = recipesData as Recipe[]

export default function Feed() {
  const { planningMode, basketCount, incrementBasketItem, decrementBasketItem } = useApp()
  const [dietMode, setDietMode] = useState<DietMode>('veg')
  const [includeEgg, setIncludeEgg] = useState(false)
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [method, setMethod] = useState<CookingMethod | 'all'>('all')

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      const dietMatch =
        dietMode === 'non-veg'
          ? recipe.dietType === 'non-veg' || recipe.dietType === 'egg'
          : recipe.dietType === 'veg' || (includeEgg && recipe.dietType === 'egg')
      const categoryMatch = category === 'all' || recipe.category === category
      const methodMatch = method === 'all' || recipe.cookingMethod === method
      return dietMatch && categoryMatch && methodMatch
    })
  }, [dietMode, includeEgg, category, method])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Recipes</h1>
      {planningMode ? (
        <p className="text-ink/60 mb-6">
          Use + / − to add recipes to your basket, then hit Continue to bring them back to your
          plan.
        </p>
      ) : (
        <p className="text-ink/60 mb-6">Pick something before decision fatigue picks for you.</p>
      )}

      <FilterBar
        dietMode={dietMode}
        onDietModeChange={(mode) => {
          setDietMode(mode)
          if (mode === 'non-veg') setIncludeEgg(false)
        }}
        includeEgg={includeEgg}
        onIncludeEggChange={setIncludeEgg}
        category={category}
        onCategoryChange={setCategory}
        method={method}
        onMethodChange={setMethod}
      />

      {filtered.length === 0 ? (
        <p className="text-ink/40 text-center py-12">No recipes match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              selectable={planningMode}
              count={basketCount(recipe.id)}
              onIncrement={() => incrementBasketItem(recipe.id)}
              onDecrement={() => decrementBasketItem(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
