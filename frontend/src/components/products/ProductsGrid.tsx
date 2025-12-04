'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import QuickAddModal from '@/components/home/QuickAddModal'
import Toast from '@/components/ui/Toast'
import Price from '@/components/ui/Price'

interface ProductsGridProps {
  selectedCategory: string
  priceRange: [number, number]
  selectedConditions: string[]
}

export default function ProductsGrid({ selectedCategory, priceRange, selectedConditions }: ProductsGridProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  // Fetch products from API
  const { products: allProducts, loading, error } = useProducts({
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  })

  // Filter products by condition
  const filteredProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return []
    
    return allProducts.filter(product => {
      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
        return false
      }
      
      return true
    })
  }, [allProducts, selectedConditions])

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts]
    
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price)
      case 'price-high':
        return products.sort((a, b) => b.price - a.price)
      case 'popular':
        return products // Can add popularity logic later
      default:
        return products
    }
  }, [filteredProducts, sortBy])

  if (loading) {
    return (
      <div className="text-center" style={{ padding: 'var(--space-12) 0' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-base)' }} className="text-gray-600">جاري تحميل المنتجات...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center" style={{ padding: 'var(--space-12) 0' }}>
        <p className="text-red-600" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-md btn-primary"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Sort Bar */}
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
        <p style={{ fontSize: 'var(--text-sm)' }} className="text-gray-600">عرض {sortedProducts.length} منتج</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input input-sm"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="newest">الأحدث</option>
          <option value="price-low">السعر: الأقل</option>
          <option value="price-high">السعر: الأعلى</option>
          <option value="popular">الأكثر مبيعاً</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid-products">
        {sortedProducts.length === 0 ? (
          <div className="col-span-2 lg:col-span-4 text-center" style={{ padding: 'var(--space-12) 0' }}>
            <p className="text-gray-500" style={{ fontSize: 'var(--text-lg)' }}>لا توجد منتجات تطابق الفلاتر المحددة</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={`/products/${product.id}`}>
              {/* Image */}
              <div className="product-card-image relative">
                {product.condition === 'new' && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="badge badge-primary">
                      جديد
                    </span>
                  </div>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-base">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.nameAr} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl md:text-6xl">📱</span>
                  )}
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="product-card-content">
              <Link href={`/products/${product.id}`}>
                <p className="product-card-brand">
                  {product.brand || 'عام'}
                </p>
                <h3 className="product-card-title group-hover:text-primary-600 transition-base">
                  {product.nameAr}
                </h3>
              </Link>
              
              <div className="product-card-footer">
                <div className="product-card-price-wrapper">
                  <span className="product-card-price">
                    <Price value={product.price} currency="ريال" />
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="product-card-old-price">
                      <Price value={product.originalPrice} currency="ريال" />
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedProduct(product)
                    setIsModalOpen(true)
                  }}
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
          ))
        )}
      </div>

      {/* Quick Add Modal */}
      {selectedProduct && (
        <QuickAddModal
          product={{
            _id: selectedProduct.id,
            nameAr: selectedProduct.nameAr,
            brand: selectedProduct.brand,
            price: selectedProduct.price,
            images: selectedProduct.images,
            colors: selectedProduct.colors,
            storage: selectedProduct.storage,
          }}
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
    </div>
  )
}
