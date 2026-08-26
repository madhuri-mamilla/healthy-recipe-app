import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { initAnalytics, trackPageView } from './lib/analytics'
import Layout from './components/Layout'
import Login from './pages/Login'
import Feed from './pages/Feed'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import Plan from './pages/Plan'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route
          path="/feed"
          element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <RequireAuth>
              <RecipeDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route
          path="/plan"
          element={
            <RequireAuth>
              <Plan />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}
