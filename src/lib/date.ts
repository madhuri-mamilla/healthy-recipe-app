// Local-date (not UTC) helpers so plan cells line up with the user's actual
// calendar day regardless of timezone offset.

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function formatDayLabel(date: Date): { weekday: string; day: string } {
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
    day: String(date.getDate()),
  }
}
