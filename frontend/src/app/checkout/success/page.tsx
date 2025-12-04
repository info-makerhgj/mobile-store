'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiCheckCircle, FiLoader } from 'react-icons/fi'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const tapId = searchParams.get('tap_id')
      const orderId = searchParams.get('orderId')

      if (!tapId) {
        setError('معرف الدفع غير موجود')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/payments/tap/verify/${tapId}`
        )
        const data = await response.json()

        if (data.success && data.status === 'completed') {
          // الدفع ناجح - إيقاف التحميل وعرض رسالة النجاح
          setVerifying(false)
          setError('')
          
          // التوجيه لصفحة التأكيد بعد 3 ثواني
          setTimeout(() => {
            router.push(`/order-success?orderId=${data.orderId || orderId}&payment=tap`)
          }, 3000)
        } else {
          setError('فشل التحقق من الدفع')
          setVerifying(false)
        }
      } catch (error) {
        console.error('Verification error:', error)
        setError('حدث خطأ أثناء التحقق من الدفع')
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            {verifying ? (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiLoader className="text-blue-600 text-4xl animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-4">جاري التحقق من الدفع...</h1>
                <p className="text-gray-600">
                  الرجاء الانتظار بينما نتحقق من عملية الدفع
                </p>
              </>
            ) : error ? (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-600 text-4xl">✕</span>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-red-600">فشل التحقق</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => router.push('/orders')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
                >
                  عرض طلباتي
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-green-600">
                  تم الدفع بنجاح!
                </h1>
                <p className="text-gray-600">جاري تحويلك...</p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
