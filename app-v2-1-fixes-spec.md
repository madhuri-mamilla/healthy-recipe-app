# Recipe App — V2.1 Spec (Planning fixes)

## Why this exists
After testing the first V2 planning build, four issues came up that need fixing before V2 is actually done. This doc supersedes the relevant parts of `app-v2-spec.md` — read this one for planning behavior, not the original.

---

## Fix 1: Separate "view plan" from "add to plan"

**Problem:** the single "Plan" nav button forced the basket-selection flow every time, even when the user just wanted to check what's already planned.

**Fix:**
- Nav becomes: **Recipes | Favorites | Plan**
- **Plan** is now a standalone, always-accessible **calendar view** — shows the day×meal-slot grid with whatever's currently placed. No selection mode triggered just by visiting it.
- On the Plan screen, an **"Add recipes"** button is what triggers the old flow: takes the user to the feed in selection mode → basket → Continue → **back to the Plan screen**, with new picks appearing in an "unplaced" list next to the calendar, ready to be placed.

## Fix 2: Define what happens after placing items

**Problem:** no clear end-state after adding recipes to the calendar.

**Fix:** the Plan screen *is* the home base. After adding recipes and placing them, the user simply lands back on Plan with the calendar reflecting their choices — no separate "confirm" or "finish" screen needed. They can leave, come back anytime via the nav, and see the same state. Unplaced items (added but not yet assigned to a date/slot) persist in the "unplaced" list until placed or removed — no forced completion.

## Fix 3: Support planning the same recipe multiple times

**Problem:** planning "Chicken Roll" a second time overwrote its first placement instead of adding a second instance — because planning status lived as a single field per recipe.

**Root cause:** planning state was stored on `UserRecipeState` (one row per recipe per user), which can't represent "this recipe is planned twice, for two different date/slot combos."

**Fix — new entity, replaces planning fields on UserRecipeState:**
```
PlannedMeal {
  id
  recipeId
  date
  mealSlot: breakfast | lunch | dinner | snack
  status: planned | made_it
}
```
`UserRecipeState` goes back to being favorites-only (`status: fav`, or simplified to a boolean). Multiple `PlannedMeal` rows can reference the same `recipeId` — this is what makes repeats work.

**Selection UI change:** in planning mode, each recipe card gets a **stepper** (− / count / +) instead of a single tap-to-select checkmark. Tapping + twice on the same recipe adds 2 separate instances to the basket, each independently placeable on the calendar.

## Fix 4: Terminology
This is a **website**, not an app — for anywhere this distinction shows up in copy (empty states, headers, etc.), use "website" or just the product name.

## Fix 5: Quick-add to plan from Recipe Detail

**Problem:** planning a recipe you're already looking at on Recipe Detail required leaving the page — back to the feed, into selection mode, through the basket, over to Plan — just to place the one recipe in front of you.

**Fix:** a **"Plan this"** button sits next to "Add to Favorites" on Recipe Detail. Tapping it opens a small popup with a date picker (bounded to the same 7-day window the Plan calendar shows) and a meal-slot selector. Confirming creates a new `PlannedMeal` entry for that recipe immediately — no navigation away from Recipe Detail, and it bypasses the basket/selection-mode flow entirely. The new instance shows up right away in the planned-instances list already on the page, each with its own Made It control per Fix 3.

---

## Made It (unchanged from V2, now keyed to PlannedMeal instead of UserRecipeState)
Still available in two places — Recipe Detail and the Plan screen — but now updates the specific `PlannedMeal` instance's status, not a single per-recipe status. If a recipe has two planned instances, marking one "Made It" doesn't affect the other.

---

## Out of scope (still deferred)
- Drag-and-drop (still a fast-follow, unaffected by this fix)
- Grocery list generation (V3)
- Editing a placed meal's date/slot after placement (add later if needed — for now, removing and re-placing works)
