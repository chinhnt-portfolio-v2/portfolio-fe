import { useCallback, useState } from 'react'

import { Menu, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MobileSheet } from './MobileSheet'
import { MagneticWrapper } from '@/components/cursor/MagneticWrapper'
import { Button } from '@/components/ui/button'
import { useCursorStore } from '@/stores/cursorStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useThemeStore } from '@/stores/themeStore'

const NAV_LINK_DEFS = [
  { sectionId: 'projects', labelKey: 'projects' },
  { sectionId: 'about',    labelKey: 'about' },
  { sectionId: 'contact', labelKey: 'contact' },
] as const

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
      className="focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
      className="focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 font-mono text-sm"
      aria-label={t('nav.switchLanguage')}
    >
      <span className={language === 'en' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
        EN
      </span>
      <span className="mx-0.5 text-muted-foreground/40">|</span>
      <span className={language === 'vi' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
        VI
      </span>
    </Button>
  )
}

/** Scrolls to a section element, handling both same-page and cross-page (router push) cases. */
function scrollToSection(sectionId: string) {
  // If already on the home page, scroll directly
  if (window.location.pathname === '/') {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    // Navigate home then scroll — push state so the hash doesn't create a history entry
    const target = `${window.location.origin}/#${sectionId}`
    window.location.href = target
  }
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()
  const { setCursorType } = useCursorStore()

  const navItems = NAV_LINK_DEFS.map((link) => ({
    sectionId: link.sectionId,
    label: t(`nav.${link.labelKey}`),
  }))

  const handleNavClick = useCallback((sectionId: string) => {
    setMobileOpen(false)
    scrollToSection(sectionId)
  }, [])

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-brand/10">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-10 lg:px-16"
      >
        {/* Logo */}
        <a
          href="/"
          className="rounded-sm text-lg font-bold tracking-tight focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('')
          }}
        >
          portfolio.
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-7 md:flex" role="list">
          {navItems.map((item) => (
            <li key={item.sectionId}>
              <MagneticWrapper>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  onMouseEnter={() => { setCursorType('pointer'); }}
                  onMouseLeave={() => setCursorType('default')}
                  className="cursor-pointer rounded-sm border-none bg-transparent p-0 text-[var(--text-small)] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {item.label}
                </button>
              </MagneticWrapper>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={t('nav.openMenu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <MobileSheet
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
      />
    </header>
  )
}
