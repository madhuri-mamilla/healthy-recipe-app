import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function FloatingBasket() {
  const { planningMode, basketTotal, exitPlanningMode } = useApp()
  const navigate = useNavigate()

  if (!planningMode) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-3 bg-ink text-cream rounded-full shadow-lg pl-2 pr-2 py-2">
        <button
          onClick={exitPlanningMode}
          aria-label="Exit planning mode"
          className="w-8 h-8 rounded-full flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/10 shrink-0"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 pr-1">
          <span className="relative text-2xl leading-none" aria-hidden="true">
            🍱
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-ink text-[11px] font-mono font-bold flex items-center justify-center">
              {basketTotal}
            </span>
          </span>
          <span className="text-sm text-cream/80 hidden sm:inline">
            {basketTotal === 1 ? '1 recipe' : `${basketTotal} recipes`}
          </span>
        </div>

        <button
          onClick={() => {
            exitPlanningMode()
            navigate('/plan')
          }}
          className="px-4 py-2 rounded-full bg-accent text-ink text-sm font-semibold hover:brightness-95 transition-[filter]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
