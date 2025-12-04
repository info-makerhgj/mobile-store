'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, total: cartTotal } = useCart()

  const subtotal = cartTotal
  // لا نحسب الشحن هنا - سيتم حسابه في صفحة الدفع بعد اختيار العنوان
  const shipping = 0
  const total = subtotal

  if (cartItems.length === 0) {
    return (
      <main className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center" style={{ padding: 'var(--space-4)' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto var(--space-4)' 
            }} className="bg-gray-100 rounded-full flex items-center justify-center">
              <span style={{ fontSize: '3rem' }}>🛒</span>
            </div>
            <h1 style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: 'var(--font-bold)', 
              marginBottom: 'var(--space-2)' 
            }} className="text-gray-900">السلة فارغة</h1>
            <p style={{ 
              fontSize: 'var(--text-base)', 
              marginBottom: 'var(--space-6)' 
            }} className="text-gray-600">لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/products" className="btn btn-lg btn-primary" style={{ gap: 'var(--space-2)' }}>
              <FiShoppingBag size={18} />
              تصفح المنتجات
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen" dir="rtl">
      <Header />

      <div className="container-mobile" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }} className="text-gray-900">سلة مشترياتي</h1>
        </div>

        <div className="grid lg:grid-cols-3" style={{ gap: 'var(--space-6)' }}>
          {/* Cart Items */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.storage}-${index}`}
                className="card card-md flex items-center"
                style={{ gap: 'var(--space-3)' }}
              >
                {/* Image */}
                <div style={{ 
                  width: '64px', 
                  height: '64px',
                  flexShrink: 0 
                }} className="bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image?.startsWith('data:image') || item.image?.startsWith('http') ? (
                    <img 
                      src={item.image} 
                      alt={item.nameAr || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span style={{ fontSize: 'var(--text-3xl)' }}>{item.image}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 style={{ 
                    fontSize: 'var(--text-base)', 
                    fontWeight: 'var(--font-bold)', 
                    marginBottom: 'var(--space-1)' 
                  }}>{item.nameAr || item.name}</h3>
                  {(item.color || item.storage) && (
                    <div className="flex text-gray-600" style={{ gap: 'var(--space-2)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
                      {item.color && <span>اللون: {item.color}</span>}
                      {item.color && item.storage && <span>•</span>}
                      {item.storage && <span>{item.storage}</span>}
                    </div>
                  )}
                  <p style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-bold)' 
                  }} className="text-primary-600">
                    {(item.price || 0).toLocaleString('en-US')} ر.س
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end" style={{ gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => removeFromCart(item.id, item.color, item.storage)}
                    className="btn btn-icon-sm btn-ghost text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <div className="flex items-center bg-gray-100 rounded-full" style={{ gap: 'var(--space-1)', padding: 'var(--space-1)' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.storage)}
                      className="btn btn-icon-sm btn-ghost"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span style={{ 
                      width: '28px', 
                      textAlign: 'center', 
                      fontWeight: 'var(--font-bold)', 
                      fontSize: 'var(--text-sm)' 
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.storage)}
                      className="btn btn-icon-sm btn-ghost"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card card-lg sticky" style={{ top: '80px' }}>
              <h2 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-bold)', 
                marginBottom: 'var(--space-4)' 
              }} className="text-gray-900">ملخص الطلب</h2>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div className="flex justify-between text-gray-600" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                  <span>المجموع الفرعي</span>
                  <span style={{ fontWeight: 'var(--font-bold)' }}>{subtotal.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-600" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                  <span>الشحن</span>
                  <span style={{ fontWeight: 'var(--font-bold)' }} className="text-gray-500">
                    يُحسب في صفحة الدفع
                  </span>
                </div>
                <div className="alert alert-info" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  💡 سيتم حساب تكلفة الشحن بناءً على عنوانك في صفحة الدفع
                </div>
                <div className="border-t flex justify-between" style={{ 
                  paddingTop: 'var(--space-3)', 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 'var(--font-bold)',
                  marginTop: 'var(--space-3)'
                }}>
                  <span>المجموع</span>
                  <span className="text-primary-600">{total.toLocaleString('en-US')} ر.س</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-full btn-primary" style={{ marginBottom: 'var(--space-2)' }}>
                إتمام الطلب
              </Link>

              <Link href="/products" className="btn btn-full btn-outline">
                متابعة التسوق
              </Link>

              <div style={{ marginTop: 'var(--space-4)' }} className="text-gray-600">
                <div className="flex items-center" style={{ gap: 'var(--space-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  <span>✓</span>
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center" style={{ gap: 'var(--space-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  <span>✓</span>
                  <span>إرجاع مجاني خلال 14 يوم</span>
                </div>
                <div className="flex items-center" style={{ gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                  <span>✓</span>
                  <span>ضمان شامل لمدة سنتين</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
