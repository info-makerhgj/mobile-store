'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import QuickAddModal from './QuickAddModal'
import Toast from '@/components/ui/Toast'

interface Product {
  _id: string
  nameAr: string
  brand: string
  tagline?: string
  price: number
  originalPrice?: number
  images?: string[]
  colors?: string[]
  storage?: string[]
}

interface ProductSliderProps {
  title: string
  subtitle?: string
  products: Product[]
}

export default function ProductSlider({ title, subtitle, products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (products.length === 0) return null

  return (
    <section className="py-8 md:py-12 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="text-center mb-3 md:mb-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-xs md:text-sm">
                {subtitle}
              </p>
            )}
          </div>
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2 justify-center">
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center"
              aria-label="السابق"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center"
              aria-label="التالي"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card flex-shrink-0 w-[180px] md:w-[240px]"
            >
              {/* Product Image */}
              <Link href={`/products/${product._id}`}>
                <div className="product-card-image relative">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={product.nameAr}
                    className="w-full h-full object-contain group-hover:scale-105 transition-base"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="product-card-content" dir="rtl">
                <Link href={`/products/${product._id}`}>
                  <p className="product-card-brand">
                    {product.brand}
                  </p>
                  <h3 className="product-card-title">
                    {product.nameAr}
                  </h3>
                </Link>
                
                <div className="product-card-footer">
                  <div className="product-card-price-wrapper">
                    <span className="product-card-price">
                      {product.price.toLocaleString()} ريال
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="product-card-old-price">
                        {product.originalPrice.toLocaleString()} ريال
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="product-card-add-btn"
                    aria-label="إضافة للسلة"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Payment Options - Tabby & Tamara */}
                <div style={{ 
                  width: '100%',
                  marginTop: '10px',
                  paddingTop: '8px',
                  borderTop: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    fontSize: '9px', 
                    color: '#9ca3af',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    قسّمها على طريقتك، اشترِ الآن وادفع لاحقاً
                  </p>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <img 
                      src="https://media.extra.com/i/aurora/tabby_new" 
                      alt="Tabby"
                      style={{ width: '55px', height: 'auto', display: 'block' }}
                    />
                    <div style={{ 
                      width: '1px', 
                      height: '18px', 
                      backgroundColor: '#d1d5db' 
                    }}></div>
                    <img 
                      src="https://media.extra.com/i/aurora/tamaralogo_ar?fmt=auto&w=96" 
                      alt="Tamara"
                      style={{ width: '55px', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-6">
          <Link
            href="/products"
            className="inline-block text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            عرض جميع المنتجات ←
          </Link>
        </div>
      </div>

      {/* Quick Add Modal */}
      {selectedProduct && (
        <QuickAddModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
          onAddSuccess={() => setShowToast(true)}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="✓ تم إضافة المنتج للسلة بنجاح"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  )
}
