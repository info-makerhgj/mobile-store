/**
 * Format price for display - fixes hydration errors
 * Always returns consistent format on server and client
 */
export function formatPrice(price: number): string {
  // Use simple number formatting without locale to avoid hydration issues
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format price with currency
 */
export function formatPriceWithCurrency(price: number, currency: string = 'ر.س'): string {
  return `${formatPrice(price)} ${currency}`
}
