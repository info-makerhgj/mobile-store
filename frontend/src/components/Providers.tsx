'use client'

import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/lib/store'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}
