'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { i18nConfig, Locale, Currency } from './config'
import { Dictionary } from './utils'

interface I18nContextType {
  locale: Locale
  currency: Currency
  dictionary: Dictionary | null
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  t: (key: string, params?: Record<string, string | number>) => string
  formatPrice: (price: number) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ 
  children, 
  initialLocale = i18nConfig.defaultLocale,
  dictionary: initialDictionary 
}: { 
  children: React.ReactNode
  initialLocale?: Locale
  dictionary?: Dictionary 
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [currency, setCurrencyState] = useState<Currency>('en')
  const [dictionary, setDictionary] = useState<Dictionary | null>(initialDictionary || null)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    // Update currency based on locale
    if (newLocale === 'en') {
      setCurrencyState('en')
    } else {
      setCurrencyState(newLocale as Currency)
    }
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    if (!dictionary) return key
    
    let value = key.split('.').reduce((obj, k) => obj?.[k], dictionary) as string
    
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([param, val]) => {
        value = value.replace(`{${param}}`, String(val))
      })
    }
    
    return value || key
  }

  const formatPrice = (price: number) => {
    const { amount, symbol } = convertPrice(price, 'en', currency)
    return `${symbol}${amount.toLocaleString()}`
  }

  const convertPrice = (
    price: number,
    fromCurrency: Currency = 'en',
    toCurrency: Currency = 'en'
  ) => {
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

  return (
    <I18nContext.Provider value={{
      locale,
      currency,
      dictionary,
      setLocale,
      setCurrency,
      t,
      formatPrice
    }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
