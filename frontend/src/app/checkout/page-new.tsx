'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { FiCreditCard, FiShoppingBag, FiMapPin, FiCheck, FiAlertCircle, FiPackage } from 'react-icons/fi'

interface PaymentMethod {
  id: string
  name: string
  nameAr: string
  enabled: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, total: cartTotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [taxRate, setTaxRate] = useState(0.15)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState<any>(null)
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    street: '',
    buildingNumber: '',
    additionalInfo: '',
  })
  
  const [selectedPayment, setSelectedPayment] = useState('')

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }
    
    fetchPaymentMethods()
    fetchTaxSettings()
  }, [cartItems, router])

  useEffect(() => {
    if (shippingInfo.city) {
      fetchShippingOptions()
    }
  }, [shippingInfo.city])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/methods`)
      const data = await response.json()
      
      if (data.success) {
        // إضافة COD دائماً
        const methods = [
          { id: 'cod', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', enabled: true },
          ...data.methods.filter((m: any) => m.enabled)
        ]
        setPaymentMethods(methods)
        
        // اختيار COD افتراضياً
        if (methods.length > 0) {
          setSelectedPayment('cod')
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      // إضافة COD على الأقل
      setPaymentMethods([
        { id: 'cod', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', enabled: true }
      ])
      setSelectedPayment('cod')
    }
  }

  const fetchTaxSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/tax`)
      const data = await response.json()
      if (data.success && data.tax.enabled) {
        setTaxRate(data.tax.rate)
      }
    } catch (error) {
      console.error('Error fetching tax settings:', error)
    }
  }

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/rates?city=${encodeURIComponent(shippingInfo.city)}`)
      const data = await response.json()
      if (data.success && data.rates.length > 0) {
        setShippingOptions(data.rates)
        // اختيار أول خيار افتراضياً
        setSelectedShipping(data.rates[0])
      } else {
        setShippingOptions([])
        setSelectedShipping(null)
      }
    } catch (error) {
      console.error('Error fetching shipping options:', error)
      setShippingOptions([])
      setSelectedShipping(null)
    }
  }

  // حساب الأسعار
  const subtotal = cartTotal
  const shippingCost = selectedShipping?.price || 0
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من الحقول
    if (!shippingInfo.fullName || shippingInfo.fullName.length < 3) {
      setError('الاسم الكامل مطلوب (3 أحرف على الأقل)')
      return
    }
    
    if (!shippingInfo.phone || shippingInfo.phone.length < 10) {
      setError('رقم الجوال غير صحيح')
      return
    }
    
    if (!shippingInfo.city) {
      setError('المدينة مطلوبة')
      return
    }
    
    if (!shippingInfo.district) {
      setError('الحي مطلوب')
      return
    }
    
    if (!shippingInfo.street) {
      setError('الشارع مطلوب')
      return
    }
    
    setError('')
    setStep(2)
  }

  const handlePayment = async () => {
    if (!selectedPayment) {
      setError('الرجاء اختيار طريقة الدفع')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      // إنشاء الطلب (مع أو بدون تسجيل دخول)
      const headers: any = {
        'Content-Type': 'application/json',
      }
      
      // إضافة التوكن فقط إذا كان موجود
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingInfo,
          paymentMethod: selectedPayment,
          shippingProviderId: selectedShipping?.providerId,
          shippingCost: shippingCost,
          taxRate: taxRate,
          isGuest: !token, // تحديد إذا كان طلب زائر
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'فشل في إنشاء الطلب')
      }

      // إذا كان COD، الطلب جاهز
      if (selectedPayment === 'cod') {
        clearCart()
        router.push(`/orders/${orderData.order.id}?status=success&payment=cod`)
        return
      }

      // إذا كان دفع إلكتروني، توجيه لبوابة الدفع
      if (orderData.payment && orderData.payment.paymentUrl) {
        window.location.href = orderData.payment.paymentUrl
      } else {
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

  const saudiCities = [
    'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'القصيم',
    'حائل', 'جازان', 'نجران', 'الباحة', 'الجوف', 'عرعر', 'الخبر', 'الظهران',
    'أبها', 'خميس مشيط', 'ينبع', 'الأحساء'
  ]

  return (
    <main className="bg-gray-50 min-h-screen" dir="rtl">
      <Header />

      <div className="container-custom py-8">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 1 ? <FiCheck /> : '1'}
            </div>
            <span className={`font-bold ${step >= 1 ? 'text-primary-600' : 'text-gray-600'}`}>
              معلومات الشحن
            </span>
          </div>

          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full transition-all ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}
                 style={{ width: step >= 2 ? '100%' : '0%' }} />
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`font-bold ${step >= 2 ? 'text-primary-600' : 'text-gray-600'}`}>
              الدفع
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <FiAlertCircle className="text-red-600" size={24} />
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        )}

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
                  <div>
                    <label className="block text-sm font-bold mb-2">الاسم الكامل *</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="أحمد محمد"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">رقم الجوال *</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="05xxxxxxxx"
                      required
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">المدينة *</label>
                    <select
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      required
                    >
                      <option value="">اختر المدينة</option>
                      {saudiCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">الحي *</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="النرجس"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">الشارع *</label>
                    <input
                      type="text"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="شارع التحلية"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">رقم المبنى (اختياري)</label>
                    <input
                      type="text"
                      value={shippingInfo.buildingNumber}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, buildingNumber: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      value={shippingInfo.additionalInfo}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, additionalInfo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                      placeholder="مثال: بجانب المسجد، الدور الثاني"
                      rows={3}
                    />
                  </div>

                  {/* اختيار شركة الشحن */}
                  {shippingInfo.city && shippingOptions.length > 0 && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-bold mb-3">اختر شركة الشحن *</label>
                      <div className="space-y-2">
                        {shippingOptions.map((option) => (
                          <button
                            key={option.providerId}
                            type="button"
                            onClick={() => setSelectedShipping(option)}
                            className={`w-full p-4 border-2 rounded-xl transition flex items-center justify-between ${
                              selectedShipping?.providerId === option.providerId
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-300 hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedShipping?.providerId === option.providerId ? 'border-primary-600' : 'border-gray-300'
                              }`}>
                                {selectedShipping?.providerId === option.providerId && (
                                  <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{option.providerName}</p>
                                <p className="text-xs text-gray-600">
                                  التوصيل خلال {option.estimatedDays} {option.estimatedDays === 1 ? 'يوم' : 'أيام'}
                                </p>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-primary-600">
                              {option.price} ر.س
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!!(shippingInfo.city && shippingOptions.length > 0 && !selectedShipping)}
                    className="w-full bg-primary-600 text-white py-4 rounded-full font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-primary-600" size={24} />
                  <h2 className="text-2xl font-bold">طريقة الدفع</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-4 border-2 rounded-xl transition flex items-center justify-between ${
                        selectedPayment === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? 'border-primary-600' : 'border-gray-300'
                        }`}>
                          {selectedPayment === method.id && (
                            <div className="w-3 h-3 bg-primary-600 rounded-full" />
                          )}
                        </div>
                        <span className="font-bold">{method.nameAr}</span>
                      </div>
                      {method.id === 'cod' && (
                        <FiPackage className="text-primary-600" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-300 py-4 rounded-full font-bold hover:border-primary-600 hover:text-primary-600 transition"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading || !selectedPayment}
                    className="flex-1 bg-primary-600 text-white py-4 rounded-full font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'جاري المعالجة...' : 'إتمام الطلب'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-sm">
              <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.storage}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image?.startsWith('data:') || item.image?.startsWith('http') ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">{item.image}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.nameAr || item.name}</p>
                      <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary-600">{item.price.toLocaleString()} ر.س</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الشحن {selectedShipping && `(${selectedShipping.providerName})`}</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${shippingCost} ر.س`
                    )}
                  </span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>الضريبة ({(taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-bold">{tax.toLocaleString()} ر.س</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary-600">{total.toLocaleString()} ر.س</span>
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
