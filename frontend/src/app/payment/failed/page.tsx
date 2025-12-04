'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiXCircle, FiShoppingCart, FiHome } from 'react-icons/fi'

function PaymentFailedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="text-red-600" size={48} />
            </div>

            <h1 className="text-3xl font-bold mb-4">فشلت عملية الدفع</h1>
            <p className="text-gray-600 mb-8">
              عذراً، لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-600">رقم الطلب الملغي</p>
                <p className="font-bold text-lg">{orderId}</p>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8 text-right">
              <p className="font-bold mb-2">💡 نصائح:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• تحقق من رصيد بطاقتك</li>
                <li>• تأكد من صحة بيانات البطاقة</li>
                <li>• جرب طريقة دفع أخرى</li>
                <li>• أو اختر "الدفع عند الاستلام"</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition"
              >
                <FiShoppingCart size={20} />
                إعادة المحاولة
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}
