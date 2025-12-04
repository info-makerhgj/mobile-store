'use client'

import Link from 'next/link'
import { useRef } from 'react'

const products = [
  {
    id: '1',
    name: 'Abaad X Pro',
    nameAr: 'أبعاد X برو',
    price: 2999,
    originalPrice: 3499,
    badge: 'جديد',
    badgeColor: 'bg-primary-600',
    category: 'smartphones',
    icon: '📱'
  },
  {
    id: '2',
    name: 'Abaad X Lite',
    nameAr: 'أبعاد X لايت',
    price: 1799,
    originalPrice: 2199,
    badge: 'الأكثر مبيعاً',
    badgeColor: 'bg-red-600',
    category: 'smartphones',
    icon: '📱'
  },
  {
    id: '3',
    name: 'Abaad Watch Elite',
    nameAr: 'أبعاد واتش إيليت',
    price: 899,
    originalPrice: 1099,
    badge: 'خصم 18%',
    badgeColor: 'bg-green-600',
    category: 'smartwatches',
    icon: '⌚'
  },
  {
    id: '4',
    name: 'Abaad Buds Pro',
    nameAr: 'أبعاد بودز برو',
    price: 499,
    originalPrice: 699,
    badge: 'عرض خاص',
    badgeColor: 'bg-orange-600',
    category: 'headphones',
    icon: '🎧'
  },
]

export default function ProductGrid() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-8 md:py-16">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">المنتجات المميزة</h2>
            <p className="text-sm md:text-base text-gray-600">أحدث المنتجات بأفضل الأسعار</p>
          </div>
          <Link 
            href="/products" 
            className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 md:gap-2 text-sm md:text-base"
          >
            عرض الكل
            <span>←</span>
          </Link>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile Scroll */}
        <div 
          ref={scrollRef}
          className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-[280px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl md:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 block"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-purple-50 p-6 md:p-8">
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
          <span className={`${product.badgeColor} text-white text-xs px-2.5 py-1 md:px-3 rounded-full font-bold`}>
            {product.badge}
          </span>
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-bold text-base md:text-lg mb-2 group-hover:text-primary-600 transition line-clamp-1">
          {product.nameAr}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3 md:mb-4">
          <span className="text-xl md:text-2xl font-bold text-primary-600">
            {product.price.toLocaleString()} ر.س
          </span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button className="w-full bg-primary-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:bg-primary-700 transition-colors">
          أضف للسلة
        </button>

        {/* Payment Options - Tabby & Tamara */}
        <div style={{ 
          width: '100%',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '9px',
            color: '#9ca3af'
          }}>
            <span>قسّمها على</span>
            <span style={{
              backgroundColor: '#3EDDB4',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 'bold',
              fontSize: '8px'
            }}>tabby</span>
            <span style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 'bold',
              fontSize: '8px'
            }}>tamara</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
