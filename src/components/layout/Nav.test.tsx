import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Nav } from './Nav'
import { useLanguageStore } from '@/stores/languageStore'
import { useThemeStore } from '@/stores/themeStore'

// Mock stores
vi.mock('@/stores/themeStore', () => ({
  useThemeStore: vi.fn(),
}))

vi.mock('@/stores/languageStore', () => ({
  useLanguageStore: vi.fn(),
}))

describe('Nav', () => {
  const mockToggleTheme = vi.fn()
  const mockSetLanguage = vi.fn()

  beforeEach(() => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    vi.mocked(useLanguageStore).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    })
    mockToggleTheme.mockClear()
    mockSetLanguage.mockClear()
  })

  it('renders without crash', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows theme toggle button with correct initial aria-label for dark mode', () => {
    render(<Nav />)
    const toggleBtn = screen.getByRole('button', { name: /switch to light mode/i })
    expect(toggleBtn).toBeInTheDocument()
  })

  it('clicking ThemeToggle calls toggleTheme', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const toggleBtn = screen.getByRole('button', { name: /switch to light mode/i })
    await user.click(toggleBtn)
    expect(mockToggleTheme).toHaveBeenCalledOnce()
  })

  it('renders all desktop navigation links with translated labels', () => {
    render(<Nav />)
    // Translation mock returns English values from en.json
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('shows moon icon in light mode with correct aria-label', () => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    render(<Nav />)
    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(toggleBtn).toBeInTheDocument()
  })

  it('LanguageToggle has aria-label="Switch language"', () => {
    render(<Nav />)
    const langBtn = screen.getByRole('button', { name: /switch language/i })
    expect(langBtn).toBeInTheDocument()
  })

  it('clicking LanguageToggle calls setLanguage with vi when language is en', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const langBtn = screen.getByRole('button', { name: /switch language/i })
    await user.click(langBtn)
    expect(mockSetLanguage).toHaveBeenCalledWith('vi')
  })

  it('clicking LanguageToggle calls setLanguage with en when language is vi', async () => {
    vi.mocked(useLanguageStore).mockReturnValue({
      language: 'vi',
      setLanguage: mockSetLanguage,
    })
    const user = userEvent.setup()
    render(<Nav />)
    const langBtn = screen.getByRole('button', { name: /switch language/i })
    await user.click(langBtn)
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })

  it('nav has aria-label="Main navigation" for landmark identification', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('desktop nav links are rendered as anchor elements (keyboard-reachable)', () => {
    render(<Nav />)
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    const aboutLink = screen.getByRole('link', { name: 'About' })
    const contactLink = screen.getByRole('link', { name: 'Contact' })
    expect(projectsLink.tagName).toBe('A')
    expect(aboutLink.tagName).toBe('A')
    expect(contactLink.tagName).toBe('A')
  })

  it('logo link has keyboard focus ring classes', () => {
    render(<Nav />)
    const logo = screen.getByRole('link', { name: 'portfolio.' })
    expect(logo.className).toContain('focus-visible:ring-2')
  })
})
