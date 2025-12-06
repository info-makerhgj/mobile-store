'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  nameAr: string
  price: number
  quantity: number
  image: string
  color?: string
  storage?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (productId: string, color?: string, storage?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string, storage?: string) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    } else {
      setItems([])
    }

    // Listen for storage changes (when cart is cleared from another component)
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('cart')
      if (updatedCart) {
        setItems(JSON.parse(updatedCart))
      } else {
        setItems([])
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const saveCart = (newItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
    setItems(newItems)
  }

  const addToCart = (product: any) => {
    // Ensure items is an array
    const currentItems = Array.isArray(items) ? items : []
    
    // Check if same product with same color and storage exists
    const existingItem = currentItems.find(item => 
      item.id === product.id && 
      item.color === product.color && 
      item.storage === product.storage
    )

    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.id === product.id && 
        item.color === product.color && 
        item.storage === product.storage
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      saveCart(updatedItems)
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name || product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        quantity: 1,
        image: product.image || product.images?.[0] || '📱',
        color: product.color,
        storage: product.storage,
      }
      saveCart([...currentItems, newItem])
    }
  }

  const removeFromCart = (productId: string, color?: string, storage?: string) => {
    const currentItems = Array.isArray(items) ? items : []
    const updatedItems = currentItems.filter(item => {
      // If color and storage are provided, match all three
      if (color !== undefined && storage !== undefined) {
        return !(item.id === productId && item.color === color && item.storage === storage)
      }
      // Otherwise just match by ID (for backward compatibility)
      return item.id !== productId
    })
    saveCart(updatedItems)
  }

  const updateQuantity = (productId: string, quantity: number, color?: string, storage?: string) => {
    if (quantity < 1) {
      removeFromCart(productId, color, storage)
      return
    }

    const currentItems = Array.isArray(items) ? items : []
    const updatedItems = currentItems.map(item => {
      // If color and storage are provided, match all three
      if (color !== undefined && storage !== undefined) {
        return (item.id === productId && item.color === color && item.storage === storage)
          ? { ...item, quantity }
          : item
      }
      // Otherwise just match by ID
      return item.id === productId ? { ...item, quantity } : item
    })
    saveCart(updatedItems)
  }

  const clearCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
    setItems([])
  }

  const itemCount = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
  const total = Array.isArray(items) ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
