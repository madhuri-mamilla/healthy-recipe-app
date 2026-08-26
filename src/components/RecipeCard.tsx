import { Link } from 'react-router-dom'
import type { Recipe } from '../types'
import { useApp } from '../context/AppContext'

const CATEGORY_LABELS: Record<Recipe['category'], string> = {
  salad: 'Salad',
  roll: 'Roll',
  'one-pot-rice': 'One-Pot Rice',
  marinade: 'Marinade',
  'noodles-pasta': 'Noodles/Pasta',
  snack: 'Snack',
  dessert: 'Dessert',
}

const DIET_LABELS: Record<Recipe['dietType'], string> = {
  veg: 'Veg',
  egg: 'Egg',
  'non-veg': 'Non-veg',
}

const DIET_STYLES: Record<Recipe['dietType'], string> = {
  veg: 'bg-veg text-white',
  egg: 'bg-accent text-ink',
  'non-veg': 'bg-nonveg text-white',
}

interface RecipeCardProps {
  recipe: Recipe
  /** Planning mode: a stepper replaces the tap-to-open-detail behavior. */
  selectable?: boolean
  count?: number
  onIncrement?: () => void
  onDecrement?: () => void
}

export default function RecipeCard({
  recipe,
  selectable,
  count = 0,
  onIncrement,
  onDecrement,
}: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useApp()
  const favorited = isFavorite(recipe.id)
  const isDessert = recipe.category === 'dessert'

  const cardBody = (
    <>
      <span
        className={`stamp-badge inline-block text-[10px] font-display italic font-semibold uppercase tracking-wide px-2.5 py-1 border rounded-sm ${
          isDessert ? 'border-plum/50 text-plum' : 'border-ink/30 text-ink/70'
        }`}
      >
        {CATEGORY_LABELS[recipe.category]}
      </span>

      <h3 className="mt-3 font-display font-semibold text-lg text-ink pr-8">
        <span className="recipe-name-underline">{recipe.name}</span>
      </h3>
      <p className="mt-1 text-sm text-ink/60 line-clamp-2">{recipe.tagline}</p>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${DIET_STYLES[recipe.dietType]}`}
        >
          {DIET_LABELS[recipe.dietType]}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-dashed border-ink/15 flex items-center gap-3 font-mono text-xs text-ink/70">
        <span>{recipe.macros.calories} cal</span>
        <span>{recipe.macros.protein_g}g protein</span>
      </div>
    </>
  )

  return (
    <div
      className={`recipe-card group relative bg-white/80 shadow-sm border transition-shadow ${
        selectable && count > 0
          ? 'border-accent ring-2 ring-accent/50 bg-accent-light/20'
          : 'border-ink/10 hover:shadow-md'
      }`}
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          toggleFavorite(recipe.id)
        }}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-lg"
      >
        {favorited ? '❤️' : '🤍'}
      </button>

      {selectable ? (
        <div className="p-4">
          {cardBody}
          <div className="mt-3 flex items-center justify-center gap-4 pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={onDecrement}
              disabled={count === 0}
              aria-label={`Remove one ${recipe.name} from basket`}
              className="w-8 h-8 rounded-full border border-ink/20 text-ink font-bold flex items-center justify-center disabled:opacity-30 hover:bg-ink/5 transition-colors"
            >
              −
            </button>
            <span className="font-mono font-semibold text-ink w-5 text-center">{count}</span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={`Add one ${recipe.name} to basket`}
              className="w-8 h-8 rounded-full bg-accent text-ink font-bold flex items-center justify-center hover:brightness-95 transition-[filter]"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <Link to={`/recipe/${recipe.id}`} className="block p-4">
          {cardBody}
        </Link>
      )}
    </div>
  )
}
