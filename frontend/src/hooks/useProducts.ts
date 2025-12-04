'use client'

import { useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  nameAr: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  images: string[]
  colors?: string[]
  storage?: string[]
  stock: number
  condition: string
  createdAt: string
}

export function useProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const query = new URLSearchParams()
        
        if (filters?.category) query.append('category', filters.category)
        if (filters?.minPrice) query.append('minPrice', filters.minPrice.toString())
        if (filters?.maxPrice) query.append('maxPrice', filters.maxPrice.toString())
        if (filters?.condition) query.append('condition', filters.condition)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${query.toString()}`
        )

        if (!response.ok) {
          throw new Error('فشل تحميل المنتجات')
        }

        const result = await response.json()
        setProducts(result.data || result || [])
        setError(null)
      } catch (err: any) {
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters?.category, filters?.minPrice, filters?.maxPrice, filters?.condition])

  return { products, loading, error }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
        )

        if (!response.ok) {
          throw new Error('فشل تحميل المنتج')
        }

        const data = await response.json()
        setProduct(data)
        setError(null)
      } catch (err: any) {
        setError(err.message)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
