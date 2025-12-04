/**
 * Format number for display (fixes hydration issues)
 * Always returns consistent format on server and client
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
