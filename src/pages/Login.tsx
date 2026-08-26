import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { user, login } = useApp()

  if (user) return <Navigate to="/feed" replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-leaf-50 px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="text-2xl font-bold text-leaf-700 mb-2">Ghar ka Khaana</h1>
        <p className="text-gray-600 mb-8">
          Indian-home-kitchen recipes for the days you have zero time to decide what to cook.
        </p>
        <button
          onClick={login}
          className="w-full py-3 rounded-full bg-leaf-600 text-white font-semibold hover:bg-leaf-700 transition-colors"
        >
          Continue
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Placeholder login for V1 — signs you in as a test user. Real Google Sign-In comes later.
        </p>
      </div>
    </div>
  )
}
