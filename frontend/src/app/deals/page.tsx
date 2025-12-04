'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hot' | 'new' | 'ending'>('all')

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      const data = await response.json()
      
      // التعامل مع البيانات سواء كانت array أو object
      const productsList = Array.isArray(data) ? data : (data.products || [])
      
      // فلترة المنتجات التي عليها عروض (لها سعر أصلي أعلى)
      const dealsProducts = productsList.filter((p: any) => 
        p.originalPrice && p.originalPrice > p.price
      )
      
      setDeals(dealsProducts)
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredDeals = () => {
    if (filter === 'all') return deals
    
    // ترتيب حسب الفلتر
    const sorted = [...deals].sort((a, b) => {
      if (filter === 'hot') {
        // أكبر خصم
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100
        return discountB - discountA
      }
      if (filter === 'new') {
        // الأحدث
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })
    
    return sorted
  }

  const filteredDeals = getFilteredDeals()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="container-mobile relative z-10 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-bold">عروض حصرية</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              عروض لا تُفوّت
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-6">
              خصومات تصل إلى 50% على أفضل الأجهزة
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>شحن مجاني</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>تقسيط بدون فوائد</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container-mobile py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`btn btn-sm whitespace-nowrap ${
                filter === 'all' ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <span>🎯</span>
              <span>كل العروض</span>
            </button>
            
            <button
              onClick={() => setFilter('hot')}
              className={`btn btn-sm whitespace-nowrap ${
                filter === 'hot' ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <span>🔥</span>
              <span>الأكثر خصماً</span>
            </button>
            
            <button
              onClick={() => setFilter('new')}
              className={`btn btn-sm whitespace-nowrap ${
                filter === 'new' ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <span>✨</span>
              <span>عروض جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="container-mobile py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{deals.length}</div>
              <div className="text-xs text-gray-600">منتج بعرض</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {deals.length > 0 
                  ? Math.max(...deals.map(d => Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100)))
                  : 0}%
              </div>
              <div className="text-xs text-gray-600">أعلى خصم</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {deals.length > 0
                  ? Math.round(deals.reduce((sum, d) => sum + ((d.originalPrice - d.price) / d.originalPrice) * 100, 0) / deals.length)
                  : 0}%
              </div>
              <div className="text-xs text-gray-600">متوسط الخصم</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-mobile py-6">
        {loading ? (
          <div className="grid-products">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card card-md">
                <div className="skeleton skeleton-image mb-3" style={{ height: '200px' }}></div>
                <div className="skeleton skeleton-text mb-2"></div>
                <div className="skeleton skeleton-title mb-3"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              لا توجد عروض حالياً
            </h3>
            <p className="text-gray-600 mb-6">
              تابعنا للحصول على أحدث العروض والخصومات
            </p>
            <Link href="/products">
              <button className="btn btn-md btn-primary">
                تصفح جميع المنتجات
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredDeals.length} منتج
              </h2>
              <div className="text-sm text-gray-600">
                {filter === 'hot' && '🔥 الأكثر خصماً'}
                {filter === 'new' && '✨ الأحدث'}
                {filter === 'all' && '🎯 جميع العروض'}
              </div>
            </div>
            
            <div className="grid-products">
              {filteredDeals.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      {!loading && filteredDeals.length > 0 && (
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <div className="container-mobile py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-white/90 mb-6">
              تصفح جميع منتجاتنا واحصل على أفضل الأسعار
            </p>
            <Link href="/products">
              <button className="btn btn-lg bg-white text-purple-600 hover:bg-gray-100">
                تصفح جميع المنتجات
              </button>
            </Link>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  )
}
