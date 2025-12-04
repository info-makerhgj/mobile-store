'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductHero from '@/components/product/ProductHero'
import ProductFeatures from '@/components/product/ProductFeatures'
import ProductSpecs from '@/components/product/ProductSpecs'
import RelatedProducts from '@/components/product/RelatedProducts'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="bg-white min-h-screen">
        <Header />
        <div className="container-custom flex items-center justify-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white">
      <Header />
      <ProductHero productId={productId} />
      <ProductFeatures productId={productId} />
      <ProductSpecs productId={productId} />
      <RelatedProducts productId={productId} />
      <Footer />
    </main>
  )
}
