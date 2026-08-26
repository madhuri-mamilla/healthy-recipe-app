import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { user, logout } = useApp()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-leaf-600 text-white' : 'text-leaf-700 hover:bg-leaf-100'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-leaf-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-bold text-leaf-700 text-lg">🌿 Ghar ka Khaana</span>
          <nav className="flex items-center gap-2">
            <NavLink to="/feed" className={linkClass}>
              Recipes
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              Favorites
            </NavLink>
            {user && (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
