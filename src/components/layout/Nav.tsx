import { useState } from 'react'

import { Menu, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MobileSheet } from './MobileSheet'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/stores/languageStore'
import { useThemeStore } from '@/stores/themeStore'

const NAV_LINK_DEFS = [
  { href: '#projects', labelKey: 'projects' },
  { href: '#about', labelKey: 'about' },
  { href: '#contact', labelKey: 'contact' },
] as const

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
      className="focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 font-mono text-sm"
      aria-label="Switch language"
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

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()

  const navLinks = NAV_LINK_DEFS.map((link) => ({
    href: link.href,
    label: t(`nav.${link.labelKey}`),
  }))

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-brand/10">
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between h-16 px-5 md:px-10 lg:px-16 max-w-[1200px] mx-auto"
      >
        {/* Logo */}
        <a
          href="/"
          className="font-bold text-lg tracking-tight focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
        >
          portfolio.
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
              >
                {link.label}
              </a>
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
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <MobileSheet
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
      />
    </header>
  )
}
