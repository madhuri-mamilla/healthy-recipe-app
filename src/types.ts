export type Category =
  | 'salad'
  | 'roll'
  | 'one-pot-rice'
  | 'marinade'
  | 'noodles-pasta'
  | 'snack'
  | 'dessert'

export type DietType = 'veg' | 'egg' | 'non-veg'

export type CookingMethod = 'air-fryer' | 'stovetop' | 'one-pot' | 'no-cook' | 'oven'

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  optional: boolean
}

export interface Macros {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
}

export interface PrepAheadStep {
  task: string
  when: 'night-before' | 'weekend'
  storesFor: string
}

export interface Recipe {
  id: string
  name: string
  tagline: string
  category: Category
  dietType: DietType
  cookingMethod: CookingMethod
  healthySwap: string
  servings: number
  prepTimeMins: number
  cookTimeMins: number
  ingredients: Ingredient[]
  macros: Macros
  prepAhead: PrepAheadStep[]
  steps: string[]
}

export interface User {
  id: string
  name: string
  authProvider: 'placeholder'
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type PlannedMealStatus = 'planned' | 'made_it'

/** One placement of a recipe onto a date + meal slot. A recipe can have
 * several of these at once (planned more than once across the week). */
export interface PlannedMeal {
  id: string
  recipeId: string
  date: string
  mealSlot: MealSlot
  status: PlannedMealStatus
}
