'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'

interface Order {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  items: Array<{
    productName: string
    productImage: string
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  shippingCost: number
  tax: number
  codFee?: number
  total: number
  shippingAddress: {
    fullName: string
    phone: string
    city: string
    district: string
    street: string
  }
  createdAt: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setOrder(data.order)
      } else {
        setError(data.message || 'فشل في جلب تفاصيل الطلب')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'في انتظار التأكيد', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FiClock }
      case 'confirmed':
        return { text: 'مؤكد', color: 'text-green-600', bg: 'bg-green-100', icon: FiCheckCircle }
      case 'processing':
        return { text: 'قيد المعالجة', color: 'text-blue-600', bg: 'bg-blue-100', icon: FiPackage }
      case 'shipped':
      case 'shipping':
        return { text: 'قيد الشحن', color: 'text-purple-600', bg: 'bg-purple-100', icon: FiTruck }
      case 'delivered':
        return { text: 'تم التوصيل', color: 'text-green-700', bg: 'bg-green-100', icon: FiCheckCircle }
      case 'cancelled':
        return { text: 'ملغي', color: 'text-red-600', bg: 'bg-red-100', icon: FiXCircle }
      default:
        return { text: status, color: 'text-gray-600', bg: 'bg-gray-100', icon: FiClock }
    }
  }

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'مدفوع', color: 'text-green-600', bg: 'bg-green-100' }
      case 'pending':
        return { text: 'قيد الانتظار', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'failed':
        return { text: 'فشل', color: 'text-red-600', bg: 'bg-red-100' }
      default:
        return { text: status, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiXCircle className="text-red-600 text-4xl" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-red-600">خطأ</h1>
              <p className="text-gray-600 mb-6">{error || 'الطلب غير موجود'}</p>
              <button
                onClick={() => router.push('/account')}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
              >
                العودة للحساب
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const paymentInfo = getPaymentStatusInfo(order.paymentStatus)
  const StatusIcon = statusInfo.icon

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">تفاصيل الطلب</h1>
                  <p className="text-gray-600">رقم الطلب: {order.orderNumber}</p>
                </div>
                <div className={`${statusInfo.bg} ${statusInfo.color} px-4 py-2 rounded-xl flex items-center gap-2`}>
                  <StatusIcon size={20} />
                  <span className="font-bold">{statusInfo.text}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">حالة الدفع</p>
                  <span className={`${paymentInfo.bg} ${paymentInfo.color} px-3 py-1 rounded-lg text-sm font-bold inline-block`}>
                    {paymentInfo.text}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">طريقة الدفع</p>
                  <p className="font-bold">
                    {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 
                     order.paymentMethod === 'tap' ? 'Tap Payments' : order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">المنتجات</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.productImage || '/placeholder.png'}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">{item.subtotal.toLocaleString('en-US')} ر.س</p>
                      <p className="text-sm text-gray-600">{item.price.toLocaleString('en-US')} ر.س × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-bold">{order.subtotal.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-bold">{order.shippingCost.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة</span>
                  <span className="font-bold">{order.tax.toLocaleString('en-US')} ر.س</span>
                </div>
                {order.codFee && order.codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">رسوم الدفع عند الاستلام</span>
                    <span className="font-bold">{order.codFee.toLocaleString('en-US')} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t text-lg">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-bold text-primary-600">{order.total.toLocaleString('en-US')} ر.س</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">عنوان التوصيل</h2>
              <div className="space-y-2">
                <p><strong>الاسم:</strong> {order.shippingAddress.fullName}</p>
                <p><strong>الجوال:</strong> {order.shippingAddress.phone}</p>
                <p><strong>المدينة:</strong> {order.shippingAddress.city}</p>
                <p><strong>الحي:</strong> {order.shippingAddress.district}</p>
                <p><strong>الشارع:</strong> {order.shippingAddress.street}</p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/account')}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                العودة للحساب
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
