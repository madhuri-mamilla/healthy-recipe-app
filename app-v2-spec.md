# Recipe App — V2 Spec (Planning)

## What this adds
V1 shipped browsing, filtering, and favoriting. V2 adds meal planning: selecting recipes and assigning them to specific days/meal slots, plus marking them as cooked.

---

## Flow

1. A **"Plan"** button sits in the nav next to Recipes/Favorites.
2. Tapping it puts the feed into **planning mode** — cards become selectable.
3. Tapping a recipe adds it to a **floating basket** at bottom-center, styled as a tiffin dabba icon with an item count. (Visual continuity with the spice-tin card design from the V1 aesthetic pass.)
4. A **"Continue"** button on the basket opens a dedicated **Plan screen**.
5. Plan screen layout: basket items on the left, a **calendar grid** on the right — days across the top, meal slots (breakfast / lunch / dinner / snack) down the side.
6. Tap a basket recipe, then tap a date+slot cell to place it there.

**Ships tap-based, not drag-and-drop.** Tap to add to basket, tap to place on the calendar. True drag-and-drop (feed→basket and basket→calendar) is a deliberate fast-follow after this flow is built and tested — explicitly out of scope for this build.

---

## Made It

A recipe moves from `planned` to `made_it` via a button, available in **two places**:
- On the Recipe Detail page
- Next to each item on the Plan screen

Either one updates the same underlying status.

---

## Data model changes

Extends the `UserRecipeState` entity already defined in `app-v1-spec.md`:

```
UserRecipeState {
  userId
  recipeId
  status: fav | planned | made_it
  plannedDate        // already reserved in V1 schema, now actually used
  mealSlot: breakfast | lunch | dinner | snack   // NEW in V2
}
```

No changes needed to the `Recipe` entity itself.

---

## Out of scope for V2 (deferred further)
- Drag-and-drop interactions (fast-follow after this ships)
- Grocery list generation from planned meals (V3)
- Editing/removing a planned meal once placed (add if needed once basic flow works)
- Recurring/repeating meal plans across weeks
