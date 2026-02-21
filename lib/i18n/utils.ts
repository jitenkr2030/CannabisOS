import { i18nConfig, Locale, Currency } from './config'

// Dictionary type
export type Dictionary = typeof import('../../locales/en/common.json')

// Get dictionary for locale
export async function getDictionary(locale: Locale = i18nConfig.defaultLocale): Promise<Dictionary> {
  const dictionaries = {
    en: () => import('../../locales/en/common.json').then(module => module.default),
    fr: () => import('../../locales/fr/common.json').then(module => module.default),
    es: () => import('../../locales/es/common.json').then(module => module.default),
  }

  return dictionaries[locale]?.() || dictionaries[i18nConfig.defaultLocale]()
}

// Currency conversion
export function convertPrice(
  price: number,
  fromCurrency: Currency = 'en',
  toCurrency: Currency = 'en'
): { amount: number; symbol: string; code: string } {
  const fromRate = i18nConfig.currency[fromCurrency].rate
  const toRate = i18nConfig.currency[toCurrency].rate
  
  const baseAmount = price / fromRate
  const convertedAmount = baseAmount * toRate
  
  return {
    amount: Math.round(convertedAmount),
    symbol: i18nConfig.currency[toCurrency].symbol,
    code: i18nConfig.currency[toCurrency].code
  }
}

// Format price with currency
export function formatPrice(
  price: number,
  currency: Currency = 'en',
  locale: Locale = 'en'
): string {
  const { amount, symbol, code } = convertPrice(price, 'en', currency)
  
  // Format based on locale
  const formatter = new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  return formatter.format(amount)
}

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const localeSegment = segments[0] as Locale
  
  if (i18nConfig.locales.includes(localeSegment)) {
    return localeSegment
  }
  
  return i18nConfig.defaultLocale
}

// Create localized path
export function createLocalizedPath(path: string, locale: Locale): string {
  if (locale === i18nConfig.defaultLocale) {
    return path
  }
  
  return `/${locale}${path}`
}
