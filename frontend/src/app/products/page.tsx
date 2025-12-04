'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductsGrid from '@/components/products/ProductsGrid'
import ProductFilters from '@/components/products/ProductFilters'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  return (
    <>
      <div className="container-mobile" style={{ paddingBottom: 'var(--space-4)', paddingTop: 'var(--space-6)' }}>
        <h1 className="hidden md:block" style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-6)' }}>جميع المنتجات</h1>
        
        <div className="flex flex-col lg:flex-row" style={{ gap: 'var(--space-6)' }}>
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <ProductFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedConditions={selectedConditions}
              setSelectedConditions={setSelectedConditions}
            />
          </aside>
          
          <div className="flex-1">
            <ProductsGrid 
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              selectedConditions={selectedConditions}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProductsPage() {
  return (
    <main className="bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="container-mobile flex items-center justify-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
