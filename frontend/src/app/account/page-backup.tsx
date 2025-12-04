'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, total: cartTotal } = useCart()

  const subtotal = cartTotal
  const shipping = subtotal >= 500 ? 0 : 50
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <main className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center px-4 py-8 md:py-0">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl md:text-5xl">🛒</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">السلة فارغة</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">لم تقم بإضافة أي منتجات بعد</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition text-sm md:text-base"
            >
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

      <div className="container-custom pb-4 md:py-8" style={{ paddingTop: '22px' }}>
        <div className="mb-6 mt-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">سلة مشترياتي</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.storage}-${index}`}
                className="bg-white rounded-xl p-3 md:p-4 flex gap-3 items-center shadow-sm border border-gray-200"
              >
                {/* Image */}
                <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image?.startsWith('data:image') || item.image?.startsWith('http') ? (
                    <img 
                      src={item.image} 
                      alt={item.nameAr || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl">{item.image}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-bold mb-1">{item.nameAr || item.name}</h3>
                  {(item.color || item.storage) && (
                    <div className="flex gap-2 text-xs text-gray-600 mb-2">
                      {item.color && <span>اللون: {item.color}</span>}
                      {item.color && item.storage && <span>•</span>}
                      {item.storage && <span>{item.storage}</span>}
                    </div>
                  )}
                  <p className="text-base md:text-lg font-bold text-primary-600">
                    {(item.price || 0).toLocaleString()} ر.س
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => removeFromCart(item.id, item.color, item.storage)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.storage)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-7 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.storage)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition"
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
            <div className="bg-white rounded-xl p-4 md:p-5 sticky top-20 shadow-sm border border-gray-200">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">ملخص الطلب</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>الشحن</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${shipping} ر.س`
                    )}
                  </span>
                </div>
                {subtotal < 500 && (
                  <div className="text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
                    أضف {(500 - subtotal).toLocaleString()} ر.س للحصول على شحن مجاني
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-base md:text-lg font-bold">
                  <span>المجموع</span>
                  <span className="text-primary-600">{total.toLocaleString()} ر.س</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary-600 text-white py-3 rounded-full font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 mb-2 text-sm md:text-base"
              >
                إتمام الطلب
              </Link>

              <Link
                href="/products"
                className="w-full border-2 border-gray-200 py-3 rounded-full font-bold hover:border-primary-500 hover:text-primary-600 transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                متابعة التسوق
              </Link>

              <div className="mt-4 space-y-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>إرجاع مجاني خلال 14 يوم</span>
                </div>
                <div className="flex items-center gap-2">
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
