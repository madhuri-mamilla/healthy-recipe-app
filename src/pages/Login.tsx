import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { user, login } = useApp()

  if (user) return <Navigate to="/feed" replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Ghar ka Khaana</h1>
        <p className="text-ink/60 mb-8">
          Indian-home-kitchen recipes for the days you have zero time to decide what to cook.
        </p>
        <button
          onClick={login}
          className="w-full py-3 rounded-full bg-accent text-ink font-semibold hover:brightness-95 transition-[filter]"
        >
          Continue
        </button>
        <p className="text-xs text-ink/40 mt-4">
          Placeholder login for V1 — signs you in as a test user. Real Google Sign-In comes later.
        </p>
      </div>
    </div>
  )
}
