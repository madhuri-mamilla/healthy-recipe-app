import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import FloatingBasket from './FloatingBasket'

export default function Layout() {
  const { user, logout, planningMode, exitPlanningMode } = useApp()

  const pillClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-accent text-ink' : 'text-ink/70 hover:bg-ink/5'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-display font-semibold text-ink text-lg">🌿 Ghar ka Khaana</span>
          <nav className="flex items-center gap-2">
            <NavLink to="/feed" className={pillClass} onClick={exitPlanningMode}>
              Recipes
            </NavLink>
            <NavLink to="/favorites" className={pillClass}>
              Favorites
            </NavLink>
            <NavLink to="/plan" className={pillClass}>
              Plan
            </NavLink>
            {user && (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-ink/50 hover:bg-ink/5"
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className={`flex-1 max-w-5xl w-full mx-auto px-4 py-6 ${planningMode ? 'pb-24' : ''}`}>
        <Outlet />
      </main>
      <FloatingBasket />
    </div>
  )
}
