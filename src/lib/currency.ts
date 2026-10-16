export const DEFAULT_CURRENCY = 'GEL' as const

export function formatCurrency(
  amount: number,
  locale = 'ka-GE',
  currency: string = DEFAULT_CURRENCY,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}
