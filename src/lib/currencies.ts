export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before' as const,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'before' as const,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'before' as const,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    position: 'before' as const,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    position: 'before' as const,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    position: 'before' as const,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    position: 'before' as const,
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    position: 'after' as const,
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    position: 'after' as const,
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    position: 'after' as const,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    position: 'before' as const,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    position: 'before' as const,
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    position: 'before' as const,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    position: 'before' as const,
  },
  HKD: {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    position: 'before' as const,
  },
  NZD: {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    position: 'before' as const,
  },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode]
  const formattedAmount = amount.toFixed(2)
  
  if (currency.position === 'before') {
    return `${currency.symbol}${formattedAmount}`
  } else {
    return `${formattedAmount} ${currency.symbol}`
  }
}

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode].symbol
}

export function getCurrencyName(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode].name
}
