import { Link, Navigate, useParams } from 'react-router-dom'
import recipesData from '../data/recipes.json'
import type { Recipe } from '../types'
import { useApp } from '../context/AppContext'

const recipes = recipesData as Recipe[]

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const { isFavorite, toggleFavorite } = useApp()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) return <Navigate to="/feed" replace />

  const favorited = isFavorite(recipe.id)

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/feed" className="text-sm text-ink/60 hover:text-ink hover:underline">
        ← Back to recipes
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{recipe.name}</h1>
          <p className="text-ink/60 mt-1">{recipe.tagline}</p>
        </div>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
            favorited
              ? 'bg-accent-light text-ink border border-accent'
              : 'bg-accent text-ink hover:brightness-95'
          }`}
        >
          {favorited ? '❤️ Favorited' : 'Add to Favorites'}
        </button>
      </div>

      <div className="mt-4 bg-accent-light/40 border border-accent/40 rounded-xl px-4 py-3 text-sm">
        <span className="font-semibold text-ink">Healthy swap: </span>
        {recipe.healthySwap}
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Stat label="Servings" value={String(recipe.servings)} />
        <Stat label="Prep" value={`${recipe.prepTimeMins} min`} />
        <Stat label="Cook" value={`${recipe.cookTimeMins} min`} />
        <Stat label="Calories" value={`${recipe.macros.calories}`} />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
        <Macro label="Protein" value={`${recipe.macros.protein_g}g`} />
        <Macro label="Carbs" value={`${recipe.macros.carbs_g}g`} />
        <Macro label="Fat" value={`${recipe.macros.fat_g}g`} />
        <Macro label="Fiber" value={`${recipe.macros.fiber_g}g`} />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">Ingredients</h2>
        <ul className="space-y-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex justify-between text-sm border-b border-ink/10 pb-1.5">
              <span>
                {ing.name}
                {ing.optional && <span className="text-ink/40"> (optional)</span>}
              </span>
              <span className="font-mono text-ink/60 shrink-0 ml-4 text-right">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">Steps</h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent-light text-ink font-mono font-semibold flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {recipe.prepAhead.length > 0 && (
        <section className="mt-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink mb-3">Prep-ahead</h2>
          <ul className="space-y-2">
            {recipe.prepAhead.map((p, i) => (
              <li key={i} className="text-sm bg-white border border-ink/10 rounded-lg px-3 py-2">
                <span className="inline-block text-xs font-semibold uppercase text-veg mr-2">
                  {p.when === 'night-before' ? 'Night before' : 'Weekend'}
                </span>
                {p.task}
                {p.storesFor && <span className="text-ink/40"> · stores {p.storesFor}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl py-2.5">
      <div className="font-mono font-semibold text-ink">{value}</div>
      <div className="text-xs text-ink/40">{label}</div>
    </div>
  )
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono font-semibold text-ink">{value}</div>
      <div className="text-xs text-ink/40">{label}</div>
    </div>
  )
}
