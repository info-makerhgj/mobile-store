'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { FiCreditCard, FiShoppingBag, FiMapPin, FiCheck, FiAlertCircle } from 'react-icons/fi'
import Image from 'next/image'

interface PaymentMethod {
  id: string
  name: string
  nameAr: string
  logo: string
  type: 'card' | 'bnpl' | 'wallet'
  enabled: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, total: cartTotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    street: '',
    building: '',
    postalCode: '',
  })
  
  const [selectedPayment, setSelectedPayment] = useState('')

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
    }
    
    fetchPaymentMethods()
  }, [cartItems, router])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/methods`)
      const data = await response.json()
      
      if (data.success) {
        setPaymentMethods(data.methods)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }

  const subtotal = cartTotal
  const shipping = subtotal >= 500 ? 0 : 50
  const total = subtotal + shipping

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePayment = async () => {
    if (!selectedPayment) {
      setError('الرجاء اختيار طريقة الدفع')
      return
    }

    setLoading(true)
    setError('')

    let orderId: string | null = null

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login?redirect=/checkout')
        return
      }

      // Special case: COD (Cash on Delivery) - no payment gateway needed
      if (selectedPayment === 'cod') {
        // Create order directly for COD
        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: shippingInfo,
            paymentMethod: selectedPayment,
            status: 'confirmed', // COD orders are confirmed immediately
          }),
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
          throw new Error(orderData.message || 'فشل في إنشاء الطلب')
        }

        // Clear cart and redirect to success page
        localStorage.removeItem('cart')
        router.push(`/orders/${orderData.id}?status=success&payment=cod`)
        return
      }

      // For online payment methods: Create draft order first
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingInfo,
          paymentMethod: selectedPayment,
          status: 'draft', // Mark as draft until payment succeeds
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'فشل في إنشاء الطلب')
      }

      orderId = orderData.id

      // Try to create payment
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderData.id,
          provider: selectedPayment,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        // Payment creation failed - delete the draft order
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        throw new Error(paymentData.message || 'فشل في إنشاء عملية الدفع. الرجاء التحقق من إعدادات الدفع.')
      }

      // Redirect to payment page
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl
      } else {
        // No payment URL - delete the draft order
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        throw new Error('لم يتم إرجاع رابط الدفع')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      const errorMessage = error?.message || error?.toString() || 'حدث خطأ أثناء معالجة الدفع'
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return null
  }

  return (
    <main className="bg-gray-50 min-h-screen" dir="rtl">
      <Header />

      <div className="container-custom py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > 1 ? <FiCheck size={20} /> : '1'}
              </div>
              <span className={`font-bold ${step >= 1 ? 'text-primary-600' : 'text-gray-600'}`}>
                معلومات الشحن
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-200">
              <div
                className={`h-full transition-all ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span className={`font-bold ${step >= 2 ? 'text-primary-600' : 'text-gray-600'}`}>
                الدفع
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Info */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="text-primary-600" size={24} />
                  <h2 className="text-2xl font-bold">معلومات الشحن</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.fullName}
                        onChange={e => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">رقم الجوال *</label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={shippingInfo.phone}
                        onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">المدينة *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">الحي *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.district}
                        onChange={e => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">الشارع *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.street}
                      onChange={e => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">رقم المبنى *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.building}
                        onChange={e => setShippingInfo({ ...shippingInfo, building: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">الرمز البريدي</label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={e => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-4 rounded-full font-bold hover:bg-primary-700 transition"
                  >
                    متابعة للدفع
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <FiCreditCard className="text-primary-600" size={24} />
                    <h2 className="text-2xl font-bold">طريقة الدفع</h2>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                      <FiAlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-4 border-2 rounded-xl transition flex items-center justify-between ${
                          selectedPayment === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="text-2xl">{getPaymentIcon(method.id)}</span>
                          </div>
                          <div className="text-right">
                            <h3 className="font-bold text-lg">{method.nameAr}</h3>
                            <p className="text-sm text-gray-600">{getPaymentDescription(method.id)}</p>
                          </div>
                        </div>
                        {selectedPayment === method.id && (
                          <FiCheck className="text-primary-600" size={24} />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-gray-300 py-4 rounded-full font-bold hover:border-primary-600 hover:text-primary-600 transition"
                    >
                      رجوع
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading || !selectedPayment}
                      className="flex-1 bg-primary-600 text-white py-4 rounded-full font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'جاري المعالجة...' : 'إتمام الدفع'}
                    </button>
                  </div>
                </div>

                {/* Shipping Info Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">عنوان الشحن</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-bold text-gray-900">الاسم:</span> {shippingInfo.fullName}</p>
                    <p><span className="font-bold text-gray-900">الجوال:</span> {shippingInfo.phone}</p>
                    <p><span className="font-bold text-gray-900">البريد:</span> {shippingInfo.email}</p>
                    <p>
                      <span className="font-bold text-gray-900">العنوان:</span>{' '}
                      {shippingInfo.street}، {shippingInfo.building}، {shippingInfo.district}، {shippingInfo.city}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FiShoppingBag className="text-primary-600" size={20} />
                <h3 className="text-xl font-bold">ملخص الطلب</h3>
              </div>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3 pb-3 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image?.startsWith('data:image') || item.image?.startsWith('http') ? (
                        <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">{item.image}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1 truncate">{item.nameAr || item.name}</h4>
                      <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary-600">{item.price.toLocaleString()} ر.س</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-5 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${shipping} ر.س`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary-600">{total.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-600" size={16} />
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-600" size={16} />
                  <span>إرجاع مجاني خلال 14 يوم</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-600" size={16} />
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

function getPaymentIcon(provider: string): string {
  const icons: any = {
    tap: '💳',
    tabby: '🛍️',
    tamara: '💰',
    myfatoorah: '💵',
  }
  return icons[provider] || '💳'
}

function getPaymentDescription(provider: string): string {
  const descriptions: any = {
    tap: 'بطاقات الائتمان والخصم (مدى، فيزا، ماستركارد)',
    tabby: 'قسّم مشترياتك على 4 دفعات بدون فوائد',
    tamara: 'اشتري الآن وادفع لاحقاً على 3 أقساط',
    myfatoorah: 'جميع طرق الدفع الإلكتروني',
  }
  return descriptions[provider] || ''
}
