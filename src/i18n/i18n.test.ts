import { describe, it, expect } from 'vitest'

import en from './en.json'
import vi from './vi.json'

describe('i18n translation files', () => {
  describe('en.json', () => {
    it('has nav keys', () => {
      expect(en.nav.projects).toBeTruthy()
      expect(en.nav.about).toBeTruthy()
      expect(en.nav.contact).toBeTruthy()
    })

    it('has hero keys', () => {
      expect(en.hero.eyebrow).toBeTruthy()
      expect(en.hero.headingPrefix).toBeTruthy()
      expect(en.hero.headingHighlight).toBeTruthy()
      expect(en.hero.tagline).toBeTruthy()
      expect(en.hero.cta.evidence).toBeTruthy()
      expect(en.hero.cta.contact).toBeTruthy()
    })

    it('has projects keys', () => {
      expect(en.projects.heading).toBeTruthy()
      expect(en.projects.filter.all).toBeTruthy()
      expect(en.projects.filter.featured).toBeTruthy()
      expect(en.projects.emptyState.message).toBeTruthy()
      expect(en.projects.emptyState.reset).toBeTruthy()
    })

    it('has about keys', () => {
      expect(en.about.heading).toBeTruthy()
      expect(en.about.whyHireMe.length).toBeGreaterThan(50)
      expect(en.about.skills.heading).toBeTruthy()
      expect(en.about.availability.heading).toBeTruthy()
      expect(en.about.availability.open).toBeTruthy()
      expect(en.about.availability.selective).toBeTruthy()
      expect(en.about.availability.unavailable).toBeTruthy()
      expect(en.about.availability.location).toBeTruthy()
    })

    it('has projectDetail keys', () => {
      expect(en.projectDetail.notFound).toBeTruthy()
      expect(en.projectDetail.backToGallery).toBeTruthy()
      expect(en.projectDetail.viewLive).toBeTruthy()
      expect(en.projectDetail.viewLiveSoon).toBeTruthy()
      expect(en.projectDetail.viewLiveAriaLabel).toBeTruthy()
      expect(en.projectDetail.viewGitHub).toBeTruthy()
      expect(en.projectDetail.buildTimeline).toBeTruthy()
      expect(en.projectDetail.lessonsLearned).toBeTruthy()
    })
  })

  describe('vi.json', () => {
    it('has all the same top-level keys as en.json', () => {
      const enKeys = Object.keys(en).sort()
      const viKeys = Object.keys(vi).sort()
      expect(viKeys).toEqual(enKeys)
    })

    it('has nav keys in Vietnamese', () => {
      expect(vi.nav.projects).toBeTruthy()
      expect(vi.nav.about).toBeTruthy()
      expect(vi.nav.contact).toBeTruthy()
      // Must be different from English
      expect(vi.nav.projects).not.toBe(en.nav.projects)
    })

    it('has hero keys with Vietnamese content', () => {
      expect(vi.hero.headingPrefix).toBeTruthy()
      expect(vi.hero.headingHighlight).toBeTruthy()
      expect(vi.hero.tagline).toBeTruthy()
      expect(vi.hero.cta.evidence).toBeTruthy()
      expect(vi.hero.cta.contact).toBeTruthy()
    })

    it('has about heading translated', () => {
      expect(vi.about.heading).not.toBe(en.about.heading)
      expect(vi.about.whyHireMe.length).toBeGreaterThan(50)
    })

    it('has all availability status labels', () => {
      expect(vi.about.availability.open).toBeTruthy()
      expect(vi.about.availability.selective).toBeTruthy()
      expect(vi.about.availability.unavailable).toBeTruthy()
    })

    it('has projectDetail keys', () => {
      expect(vi.projectDetail.notFound).toBeTruthy()
      expect(vi.projectDetail.backToGallery).toBeTruthy()
      expect(vi.projectDetail.viewLive).toBeTruthy()
      expect(vi.projectDetail.viewLiveSoon).toBeTruthy()
      expect(vi.projectDetail.viewLiveAriaLabel).toBeTruthy()
      expect(vi.projectDetail.viewGitHub).toBeTruthy()
      expect(vi.projectDetail.buildTimeline).toBeTruthy()
      expect(vi.projectDetail.lessonsLearned).toBeTruthy()
    })
  })

  describe('translation parity — vi has same nested structure as en', () => {
    it('nav keys match', () => {
      expect(Object.keys(vi.nav).sort()).toEqual(Object.keys(en.nav).sort())
    })

    it('hero keys match', () => {
      expect(Object.keys(vi.hero).sort()).toEqual(Object.keys(en.hero).sort())
      expect(Object.keys(vi.hero.cta).sort()).toEqual(Object.keys(en.hero.cta).sort())
    })

    it('projects keys match', () => {
      expect(Object.keys(vi.projects).sort()).toEqual(Object.keys(en.projects).sort())
      expect(Object.keys(vi.projects.filter).sort()).toEqual(Object.keys(en.projects.filter).sort())
    })

    it('about keys match', () => {
      expect(Object.keys(vi.about).sort()).toEqual(Object.keys(en.about).sort())
      expect(Object.keys(vi.about.availability).sort()).toEqual(
        Object.keys(en.about.availability).sort()
      )
    })

    it('projectDetail keys match', () => {
      expect(Object.keys(vi.projectDetail).sort()).toEqual(Object.keys(en.projectDetail).sort())
    })
  })
})
