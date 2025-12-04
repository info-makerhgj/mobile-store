'use client'

import { useState } from 'react'
import Link from 'next/link'
import QuickAddModal from '@/components/home/QuickAddModal'
import Toast from '@/components/ui/Toast'
import Price from '@/components/ui/Price'

export default function ProductCard({ product }: { product: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  console.log('ProductCard - Product:', product.nameAr, 'Price:', product.price, 'Original:', product.originalPrice)

  return (
    <>
      <div className="product-card">
        <Link href={`/products/${product._id}`}>
          <div className="product-card-image relative">
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            )}
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.nameAr || product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-base"
              />
            ) : (
              <div className="text-6xl">📱</div>
            )}
          </div>
        </Link>
        <div className="product-card-content" dir="rtl">
          <Link href={`/products/${product._id}`}>
            <p className="product-card-brand">{product.brand}</p>
            <h3 className="product-card-title">{product.nameAr || product.name}</h3>
          </Link>
          
          <div className="product-card-footer">
            <div className="product-card-price-wrapper">
              <span className="product-card-price"><Price value={product.price} currency="ريال" /></span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="product-card-old-price"><Price value={product.originalPrice} currency="ريال" /></span>
              )}
            </div>
            <button
              onClick={handleQuickAdd}
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

      {/* Quick Add Modal */}
      <QuickAddModal
        product={{
          _id: product._id,
          nameAr: product.nameAr || product.name,
          brand: product.brand,
          price: product.price,
          images: product.images,
          colors: product.colors,
          storage: product.storage,
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={() => setShowToast(true)}
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="✓ تم إضافة المنتج للسلة بنجاح"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
