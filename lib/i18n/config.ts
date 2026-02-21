export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  currency: {
    en: { code: 'USD', symbol: '$', rate: 1 },
    fr: { code: 'CAD', symbol: '$', rate: 1.3 },
    es: { code: 'CAD', symbol: '$', rate: 1.3 }
  }
}

export type Locale = typeof i18nConfig.locales[number]
export type Currency = keyof typeof i18nConfig.currency
