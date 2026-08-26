import { Link } from 'react-router-dom'
import recipesData from '../data/recipes.json'
import type { Recipe } from '../types'
import { useApp } from '../context/AppContext'
import RecipeCard from '../components/RecipeCard'

const recipes = recipesData as Recipe[]

export default function Favorites() {
  const { favoriteIds } = useApp()
  const favorited = recipes.filter((r) => favoriteIds.includes(r.id))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Favorites</h1>
      <p className="text-gray-500 mb-6">Recipes you've saved for later.</p>

      {favorited.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No favorites yet.</p>
          <Link to="/feed" className="text-leaf-600 hover:underline text-sm mt-2 inline-block">
            Browse recipes →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorited.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
