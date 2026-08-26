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

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFavorite, toggleFavorite } = useApp()
  const favorited = isFavorite(recipe.id)

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-leaf-100 overflow-hidden hover:shadow-md transition-shadow">
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
      <Link to={`/recipe/${recipe.id}`} className="block p-4">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-leaf-600 bg-leaf-100 px-2 py-0.5 rounded-full">
          {CATEGORY_LABELS[recipe.category]}
        </span>
        <h3 className="mt-2 font-bold text-gray-900 pr-8">{recipe.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{recipe.tagline}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
          <span>{recipe.macros.calories} cal</span>
          <span>{recipe.macros.protein_g}g protein</span>
          <span className="capitalize">{recipe.dietType}</span>
        </div>
      </Link>
    </div>
  )
}
