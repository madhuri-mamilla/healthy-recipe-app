import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import FloatingBasket from './FloatingBasket'

export default function Layout() {
  const { user, logout, planningMode, togglePlanningMode, exitPlanningMode } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-accent text-ink' : 'text-ink/70 hover:bg-ink/5'
    }`

  const onFeed = location.pathname === '/feed'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-display font-semibold text-ink text-lg">🌿 Ghar ka Khaana</span>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => {
                exitPlanningMode()
                navigate('/feed')
              }}
              className={pillClass(onFeed && !planningMode)}
            >
              Recipes
            </button>
            <button
              onClick={() => {
                togglePlanningMode()
                navigate('/feed')
              }}
              className={pillClass(onFeed && planningMode)}
            >
              Plan
            </button>
            <NavLink to="/favorites" className={({ isActive }) => pillClass(isActive)}>
              Favorites
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
