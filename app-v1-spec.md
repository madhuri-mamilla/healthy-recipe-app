# Recipe App — V1 Spec

## What this is
A whimsical, Indian-flavor-forward healthy recipe app solving a real personal problem: no time/energy to decide what to cook before a workout + 3hr commute + 9-5:30 job. Differentiator vs. existing meal-planning apps (Mealime, FoodiePrep, Paprika, etc.): Indian-home-kitchen recipes, a veg/eggetarian/non-veg filter, cooking-method-first organization (air-fryer/one-pot/stovetop), and a night-before/weekend prep-ahead step built into every recipe.

## V1 scope
Prove out the core browsing experience with real recipe data. No planning, no grocery list, no real auth yet — those come in later versions (see "Not in V1" below).

---

## Screens

### 1. Login (placeholder)
- Single "Continue" button, logs in as one static test user — no real auth flow.
- Purpose: get to the actual product fast. Real Google Sign-In added in a later version.

### 2. Recipe feed (main hub)
- Grid/list of recipe cards (name, category, tagline, macros at a glance).
- **Diet filter:** toggle — Veg | Non-veg (default: Veg).
  - Veg active → show only `dietType: veg`. A checkbox "Include egg recipes" appears; if checked, also show `dietType: egg`.
  - Non-veg active → show everything (veg + egg + non-veg); checkbox hidden/irrelevant.
- **Category filter:** salad, roll, one-pot-rice, marinade, noodles-pasta, snack, dessert (dish-type based — not breakfast/lunch/dinner; meal-slot assignment happens during planning, a later version).
- **Method filter:** air-fryer, stovetop, one-pot, no-cook, oven.
- Tapping a card opens Recipe Detail.

### 3. Recipe detail
- Full recipe: name, tagline, healthySwap callout, servings, prep/cook time, ingredients with quantities, numbered steps, macros, prep-ahead instructions.
- "Add to Favorites" button.

### 4. Favorites
- List of recipes the user has favorited. Same card format as the feed, tap through to detail.

---

## Data model

```
Recipe {
  id
  name
  tagline
  category: salad | roll | one-pot-rice | marinade | noodles-pasta | snack | dessert  (extensible)
  dietType: veg | egg | non-veg
  cookingMethod: air-fryer | stovetop | one-pot | no-cook | oven
  healthySwap
  servings
  prepTimeMins / cookTimeMins
  ingredients: [{ name, quantity, unit, optional: bool }]
  macros: { calories, protein_g, carbs_g, fat_g, fiber_g }   // per serving
  prepAhead: [{ task, when: "night-before" | "weekend", storesFor }]
  steps: [ ... ]
}

User {
  id
  name
  authProvider   // stubbed in V1, real Google fields added later
}

UserRecipeState {
  userId
  recipeId
  status: fav | planned | made_it   // only "fav" is used in V1
  plannedDate   // unused in V1, reserved for later
}
```

**Reserved for later versions (not built in V1, but schema-compatible so no rework needed):**
- `PlannedMeal` — links a UserRecipeState entry to a specific date + meal slot (breakfast/lunch/dinner/snack)
- `GroceryList` — generated from a week's PlannedMeals, consolidates ingredient quantities, flags optional items

---

## Analytics
No login required to track visits — auth and analytics are decoupled. Use GA4 or Firebase Analytics (script tag / SDK) to track page views and unique visitors anonymously, independent of the placeholder login.

---

## Recipe data source
16 seed recipes with full ingredients, quantities, macros, process, and prep-ahead steps are already drafted in `recipe-draft-list.md`. These become the initial Recipe records (convert to JSON as a build step). User's own real recipes (from Instagram research) to be folded in later, same structure.

---

## Not in V1 (explicitly deferred)
- Real Google Sign-In (placeholder login only)
- Fav → Planned → Made It state transitions (only "fav" works)
- Day/week meal planning
- Grocery list generation
- Personal macro targets / BMI-BMR calculation and logging
