'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const orderId = searchParams.get('orderId')
  const paymentMethod = searchParams.get('payment')
  const totalFromUrl = searchParams.get('total')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    console.log('✅ Order Success Page Loaded')
    console.log('   orderId:', orderId)
    console.log('   paymentMethod:', paymentMethod)
    console.log('   searchParams:', Object.fromEntries(searchParams.entries()))
    
    if (!orderId) {
      console.log('⚠️ No orderId found in URL')
      // لا نوجه للرئيسية مباشرة - نعرض رسالة عامة
      setLoading(false)
      return
    }

    console.log('📡 Fetching order details...')
    fetchOrderDetails()
  }, [orderId, mounted])

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = {
        'Content-Type': 'application/json'
      }
      
      // إضافة token إذا كان موجود
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('📡 Fetching order with ID:', orderId)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers
      })

      console.log('📦 Order fetch response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Order data received:', data)
        setOrderDetails(data.order || data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Failed to fetch order:', errorData)
        // إذا فشل جلب التفاصيل، نعرض رسالة نجاح عامة
        console.log('⚠️ Could not fetch order details, showing generic success')
      }
    } catch (error) {
      console.error('💥 Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container-mobile flex items-center justify-center" style={{ minHeight: '60vh', paddingTop: 'var(--space-8)' }}>
          <div className="loading-spinner"></div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen" dir="rtl">
      <Header />

      <div className="container-mobile" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        {/* Success Card */}
        <div className="card card-lg text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Success Icon */}
          <div className="flex justify-center" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="bg-green-100 rounded-full flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
              <FiCheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          {/* Success Message */}
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }} className="text-gray-900">
            تم استلام طلبك بنجاح!
          </h1>
          <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }} className="text-gray-600">
            {paymentMethod === 'cod' 
              ? 'شكراً لك على الطلب. سنقوم بمعالجته في أقرب وقت ممكن.'
              : 'تم تأكيد الدفع بنجاح. سنقوم بمعالجة طلبك في أقرب وقت ممكن.'
            }
          </p>

          {/* Order Number */}
          <div className="bg-primary-50 rounded-xl" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }} className="text-gray-600">
              رقم الطلب
            </p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }} className="text-primary-600">
              {orderDetails 
                ? (orderDetails.orderNumber || `#${orderDetails._id?.slice(-8)}`)
                : (orderId ? (orderId.startsWith('#') ? orderId : `#${orderId}`) : '#')}
            </p>
          </div>

          {/* Payment Method */}
          {paymentMethod === 'cod' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', textAlign: 'right' }}>
              <div className="flex items-start" style={{ gap: 'var(--space-3)' }}>
                <FiPackage className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }} className="text-blue-900">
                    💰 الدفع عند الاستلام
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }} className="text-blue-800">
                    يرجى تجهيز المبلغ الإجمالي نقداً عند استلام الطلب من مندوب التوصيل.
                    <br />
                    <strong>المبلغ المطلوب: {(orderDetails?.total || totalFromUrl || 0).toLocaleString('en-US')} ر.س</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          {orderDetails && (
            <div className="border-t" style={{ paddingTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                <span className="text-gray-600">عدد المنتجات</span>
                <span style={{ fontWeight: 'var(--font-bold)' }}>{orderDetails.items?.length || 0}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                <span className="text-gray-600">المجموع</span>
                <span style={{ fontWeight: 'var(--font-bold)' }}>{(orderDetails.total || totalFromUrl || 0).toLocaleString('en-US')} ر.س</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)' }}>
                <span className="text-gray-600">حالة الطلب</span>
                <span className="badge badge-warning">قيد المعالجة</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
            <Link href="/account" className="btn btn-full btn-primary">
              عرض طلباتي
            </Link>
            <Link href="/" className="btn btn-full btn-outline">
              <FiHome size={18} />
              العودة للرئيسية
            </Link>
          </div>

          {/* Additional Info */}
          <div className="border-t text-gray-600" style={{ paddingTop: 'var(--space-6)', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني
            </p>
            <p>
              يمكنك متابعة حالة الطلب من صفحة "طلباتي"
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
