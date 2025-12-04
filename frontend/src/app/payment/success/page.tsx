'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
          
          // مسح السلة
          localStorage.removeItem('cart')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container-custom py-16 text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-green-600" size={48} />
            </div>

            <h1 className="text-3xl font-bold mb-4">تم إنشاء طلبك بنجاح! 🎉</h1>
            <p className="text-gray-600 mb-8">
              شكراً لك! تم استلام طلبك وسيتم معالجته قريباً
            </p>

            {order && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                    <p className="font-bold text-lg text-primary-600">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الإجمالي</p>
                    <p className="font-bold text-lg">{order.total?.toLocaleString()} ر.س</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">طريقة الدفع</p>
                    <p className="font-bold">
                      {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'مدفوع'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الحالة</p>
                    <p className="font-bold text-green-600">مؤكد</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/orders/${orderId}`}
                className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition"
              >
                <FiPackage size={20} />
                عرض تفاصيل الطلب
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 border-2 border-gray-300 px-6 py-3 rounded-full font-bold hover:border-primary-600 hover:text-primary-600 transition"
              >
                <FiHome size={20} />
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
