'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

function DemoPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')

  const chargeId = searchParams.get('chargeId')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')
  const orderId = searchParams.get('orderId')
  const successUrl = searchParams.get('successUrl')

  const handleSuccess = () => {
    setPaymentStatus('success')
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          const callbackUrl = `/payment/callback?tap_id=${chargeId}&order_id=${orderId}`
          window.location.href = callbackUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleFail = () => {
    setPaymentStatus('failed')
    setTimeout(() => {
      router.push('/checkout')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
        {paymentStatus === 'pending' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💳</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">🎭 وضع التجربة</h1>
            <p className="text-gray-600 mb-6">Demo Payment Mode</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-right">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">المبلغ:</span>
                <span className="font-bold">{amount} {currency}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-bold">{orderId || 'مؤقت'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">معرف الدفع:</span>
                <span className="font-mono text-sm text-gray-500">{chargeId?.slice(0, 20)}...</span>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 font-bold mb-2">⚠️ وضع تجريبي</p>
              <p className="text-yellow-700 text-sm">
                اختر نتيجة الدفع للاختبار
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSuccess}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition"
              >
                ✅ نجح الدفع
              </button>
              <button
                onClick={handleFail}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-red-700 transition"
              >
                ❌ فشل الدفع
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500">
                💡 لتفعيل الدفع الحقيقي، قم بإضافة مفاتيح Tap في إعدادات الدفع
              </p>
            </div>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h1>
            <p className="text-gray-600 mb-6">جاري إنشاء الطلب...</p>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <span className="text-3xl font-bold text-primary-600">{countdown}</span>
              </div>
              <p className="text-gray-600">جاري التحويل لصفحة التأكيد...</p>
            </div>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-red-600 mb-2">فشل الدفع</h1>
            <p className="text-gray-600 mb-6">جاري العودة للدفع...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function DemoPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <DemoPaymentContent />
    </Suspense>
  )
}
