import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import vi from './vi.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  // lng is NOT set here — App.tsx sets language dynamically via detectInitialLanguage
  fallbackLng: 'en',
  initImmediate: false, // synchronous init — avoids Suspense flash
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
