'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiXCircle } from 'react-icons/fi'

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="text-red-600 text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              تم إلغاء عملية الدفع
            </h1>
            
            <p className="text-gray-600 mb-8">
              لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
              >
                العودة للدفع
              </button>
              
              {orderId && (
                <button
                  onClick={() => router.push(`/orders/${orderId}`)}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  عرض الطلب
                </button>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
