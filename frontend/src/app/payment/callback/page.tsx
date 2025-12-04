'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const tap_id = searchParams.get('tap_id')
    const orderId = searchParams.get('order_id')
    
    console.log('💳 Payment Callback Received')
    console.log('   tap_id:', tap_id)
    console.log('   orderId:', orderId)
    
    if (!tap_id) {
      setStatus('failed')
      setMessage('معرف الدفع مفقود')
      return
    }

    verifyPayment(tap_id, orderId)
  }, [searchParams])

  const verifyPayment = async (tap_id: string, orderId: string | null) => {
    try {
      const token = localStorage.getItem('token')
      
      console.log('🔍 Verifying payment...')
      console.log('   tap_id:', tap_id)
      console.log('   orderId:', orderId)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/tap/verify/${tap_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      console.log('✅ Payment verification response:', data)
      console.log('   Response OK:', response.ok)
      console.log('   Data success:', data.success)
      console.log('   Payment status:', data.status)

      if (response.ok && data.success && data.status === 'completed') {
        setStatus('success')
        setMessage('تم الدفع بنجاح!')
        
        // إنشاء الطلب الآن بعد نجاح الدفع
        console.log('📝 Creating order after successful payment...')
        try {
          const pendingOrderData = localStorage.getItem('pendingOrder')
          console.log('📦 Pending order data:', pendingOrderData)
          
          if (pendingOrderData) {
            const orderData = JSON.parse(pendingOrderData)
            console.log('📝 Parsed order data:', orderData)
            
            // إنشاء الطلب
            console.log('🚀 Creating order with payment confirmation...')
            
            // استخراج userId المحفوظ
            const savedUserId = orderData._userId
            console.log('👤 Saved User ID:', savedUserId || 'Guest')
            
            // إنشاء token جديد إذا كان userId موجود
            let authHeader = token ? `Bearer ${token}` : undefined
            if (savedUserId && !token) {
              // إذا كان userId موجود لكن token مفقود، نستخدم userId مباشرة
              console.log('⚠️ Token missing but userId found - using saved userId')
            }
            
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
              },
              body: JSON.stringify({
                ...orderData,
                paymentId: tap_id,
                paymentStatus: 'paid',
                // تغيير الحالة إلى "confirmed" بدل "pending"
                status: 'confirmed',
                // إضافة userId مباشرة في البيانات
                _forceUserId: savedUserId,
              }),
            })
            
            console.log('📡 Order creation response status:', orderResponse.status)
            
            const createdOrder = await orderResponse.json()
            console.log('✅ Order created:', createdOrder)
            console.log('   Full response:', JSON.stringify(createdOrder, null, 2))
            
            if (orderResponse.ok) {
              // مسح البيانات المؤقتة
              localStorage.removeItem('pendingOrder')
              
              // مسح السلة بعد نجاح الدفع
              console.log('🧹 Clearing cart after successful payment...')
              localStorage.removeItem('cart')
              // إرسال event لتحديث CartContext
              window.dispatchEvent(new Event('storage'))
              
              // التوجيه لصفحة النجاح مع رقم الطلب الجديد
              const newOrderId = createdOrder.order?.orderNumber || createdOrder.order?._id || createdOrder.order?.id
              console.log('🔍 Order ID extraction:')
              console.log('   orderNumber:', createdOrder.order?.orderNumber)
              console.log('   _id:', createdOrder.order?._id)
              console.log('   id:', createdOrder.order?.id)
              console.log('   Final newOrderId:', newOrderId)
              
              const totalAmount = createdOrder.order?.total || data.amount || 0
              
              if (!newOrderId) {
                console.error('❌ No order ID found!')
                setStatus('failed')
                setMessage('تم الدفع لكن فشل في الحصول على رقم الطلب')
                return
              }
              
              // إزالة # من رقم الطلب قبل إرساله في URL
              const cleanOrderId = newOrderId.replace('#', '')
              console.log('🔗 Redirecting with clean order ID:', cleanOrderId)
              
              setTimeout(() => {
                router.push(`/order-success?orderId=${encodeURIComponent(cleanOrderId)}&payment=tap&total=${totalAmount}`)
              }, 2000)
              return
            } else {
              console.error('❌ Failed to create order:', createdOrder)
              throw new Error(createdOrder.message || 'فشل في إنشاء الطلب')
            }
          } else {
            console.error('❌ No pending order data found')
            throw new Error('لم يتم العثور على بيانات الطلب')
          }
        } catch (err) {
          console.error('⚠️ Failed to create order:', err)
          setStatus('failed')
          setMessage('تم الدفع بنجاح لكن فشل في إنشاء الطلب. الرجاء التواصل مع الدعم.')
          return
        }
      } else {
        setStatus('failed')
        setMessage(data.message || 'فشل التحقق من الدفع')
      }
    } catch (error) {
      console.error('❌ Payment verification error:', error)
      setStatus('failed')
      setMessage('حدث خطأ أثناء التحقق من الدفع')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <FiLoader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">جاري التحقق من الدفع...</h2>
            <p className="text-gray-600">الرجاء الانتظار</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">جاري التوجيه...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">فشل الدفع</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/cart')}
              className="btn btn-primary"
            >
              العودة للسلة
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
