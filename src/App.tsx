import { lazy, Suspense, useEffect } from 'react'

import { AnimatePresence, MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { PageTransition } from '@/components/layout/PageTransition'
import { useWebSocket } from '@/hooks/useWebSocket'
import i18n from '@/i18n'
import { detectInitialLanguage } from '@/lib/referral'
import HomePage from '@/pages/HomePage'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'
import { useThemeStore } from '@/stores/themeStore'

// TODO: Command palette keyboard event registry — stub reserved for future story

const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))

function AppRoutes() {
  const location = useLocation()
  const { setLastViewedSlug, updateTimestamp } = useReturnVisitorStore()

  // Track navigation to project detail pages
  useEffect(() => {
    const match = location.pathname.match(/^\/projects\/(.+)$/)
    if (match) {
      const slug = match[1]
      setLastViewedSlug(slug)
      updateTimestamp()
    }
  }, [location.pathname, setLastViewedSlug, updateTimestamp])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PageTransition>
                <ProjectDetailPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const { theme } = useThemeStore()
  const { setLanguage } = useLanguageStore()
  const { updateTimestamp, _hasHydrated } = useReturnVisitorStore()
  const { setTokens: setAuthTokens } = useAuthStore()

  // Extract OAuth2 tokens from URL and store them
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const tokenType = params.get('tokenType')

    if (accessToken && refreshToken && tokenType) {
      setAuthTokens(accessToken, refreshToken, tokenType)
      // Remove tokens from URL to clean up
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [setAuthTokens])

  // Initialize return visitor timestamp on each app load
  useEffect(() => {
    if (_hasHydrated) {
      updateTimestamp()
    }
  }, [_hasHydrated, updateTimestamp])

  // Initialize WebSocket connection for live metrics
  useWebSocket()

  // Sync theme store → HTML root class for CSS dark mode variables
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Initialize language on mount and subscribe to future store changes
  useEffect(() => {
    const lang = detectInitialLanguage(window.location.search)
    setLanguage(lang)
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang

    // Sync i18next and html[lang] whenever languageStore changes
    const unsub = useLanguageStore.subscribe((state) => {
      void i18n.changeLanguage(state.language)
      document.documentElement.lang = state.language
    })
    return unsub
  }, [setLanguage])

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MotionConfig>
  )
}
