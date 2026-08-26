// Lightweight GA4 wrapper. No-ops unless VITE_GA_MEASUREMENT_ID is set, so V1
// works out of the box without a real analytics property configured.
// Tracks page views independent of the placeholder login, per spec.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let initialized = false

export function initAnalytics() {
  if (!measurementId || initialized) return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
}

export function trackPageView(path: string) {
  if (!measurementId || !window.gtag) return
  window.gtag('event', 'page_view', { page_path: path })
}
