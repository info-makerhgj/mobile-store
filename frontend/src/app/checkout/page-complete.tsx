'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import ProgressIndicator from '@/components/ProgressIndicator';
import AddressSelector from '@/components/AddressSelector';
import OrderSummary from '@/components/OrderSummary';
import { FiCreditCard, FiPackage, FiAlertCircle } from 'react-icons/fi';

interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  enabled: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1: Address
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  // Step 2: Shipping
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [taxRate, setTaxRate] = useState(0.15);
  
  // Step 3: Payment
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');

  const steps = ['اختيار العنوان', 'شركة الشحن', 'الدفع والتأكيد'];

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // التحقق من السلة
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    fetchTaxSettings();
    fetchPaymentMethods();
  }, [cartItems, router]);

  useEffect(() => {
    if (selectedAddress?.city) {
      fetchShippingOptions();
    }
  }, [selectedAddress]);

  const fetchTaxSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/settings/tax');
      const data = await response.json();
      if (data.success && data.tax.enabled) {
        setTaxRate(data.tax.rate);
      }
    } catch (error) {
      console.error('Error fetching tax settings:', error);
    }
  };

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/shipping/rates?city=${encodeURIComponent(selectedAddress.city)}`
      );
      const data = await response.json();
      if (data.success && data.rates.length > 0) {
        setShippingOptions(data.rates);
        setSelectedShipping(data.rates[0]);
      } else {
        setShippingOptions([]);
        setSelectedShipping(null);
      }
    } catch (error) {
      console.error('Error fetching shipping options:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/payments/methods');
      const data = await response.json();
      
      if (data.success) {
        const methods = [
          { id: 'cod', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', enabled: true },
          ...data.methods.filter((m: any) => m.enabled)
        ];
        setPaymentMethods(methods);
        setSelectedPayment('cod');
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([
        { id: 'cod', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', enabled: true }
      ]);
      setSelectedPayment('cod');
    }
  };

  // حساب الأسعار
  const subtotal = cartTotal;
  const shippingCost = selectedShipping?.price || 0;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!selectedAddress) {
        setError('الرجاء اختيار عنوان التوصيل');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedShipping) {
        setError('الرجاء اختيار شركة الشحن');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPayment) {
      setError('الرجاء اختيار طريقة الدفع');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const orderResponse = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          addressId: selectedAddress.id,
          shippingAddress: selectedAddress,
          shippingProviderId: selectedShipping.providerId,
          shippingCost: shippingCost,
          taxRate: taxRate,
          paymentMethod: selectedPayment,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'فشل في إنشاء الطلب');
      }

      // إذا كان COD
      if (selectedPayment === 'cod') {
        clearCart();
        router.push(`/orders/${orderData.order.id}?status=success&payment=cod`);
        return;
      }

      // إذا كان دفع إلكتروني
      if (orderData.payment && orderData.payment.paymentUrl) {
        window.location.href = orderData.payment.paymentUrl;
      } else {
        throw new Error('لم يتم إرجاع رابط الدفع');
      }

    } catch (error: any) {
      console.error('Order error:', error);
      setError(error?.message || 'حدث خطأ أثناء إنشاء الطلب');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <main className="bg-gray-50 min-h-screen" dir="rtl">
      <Header />

      <div className="container-custom py-5 md:py-8">
        <ProgressIndicator currentStep={step} steps={steps} />

        {error && (
          <div className="mb-5 bg-red-50 border-2 border-red-200 rounded-xl p-3.5 flex items-center gap-2.5">
            <FiAlertCircle className="text-red-600" size={20} />
            <p className="text-red-600 font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <AddressSelector
                onSelect={setSelectedAddress}
                selectedAddressId={selectedAddress?.id}
              />
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <h2 className="text-base md:text-xl font-bold mb-4">اختر شركة الشحن</h2>
                
                {shippingOptions.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    <p>لا توجد شركات شحن متاحة لهذه المدينة</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {shippingOptions.map((option) => (
                      <button
                        key={option.providerId}
                        onClick={() => setSelectedShipping(option)}
                        className={`w-full p-3 border-2 rounded-xl transition flex items-center justify-between ${
                          selectedShipping?.providerId === option.providerId
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedShipping?.providerId === option.providerId
                              ? 'border-primary-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedShipping?.providerId === option.providerId && (
                              <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{option.providerName}</p>
                            <p className="text-xs text-gray-600">
                              التوصيل خلال {option.estimatedDays} {option.estimatedDays === 1 ? 'يوم' : 'أيام'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary-600 whitespace-nowrap">
                          {option.price} ر.س
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <FiCreditCard className="text-primary-600" size={18} />
                  <h2 className="text-base md:text-xl font-bold">اختر طريقة الدفع</h2>
                </div>

                <div className="space-y-2.5">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-3 border-2 rounded-xl transition flex items-center justify-between ${
                        selectedPayment === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPayment === method.id ? 'border-primary-600' : 'border-gray-300'
                        }`}>
                          {selectedPayment === method.id && (
                            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                          )}
                        </div>
                        <span className="font-semibold text-sm">{method.nameAr}</span>
                      </div>
                      {method.id === 'cod' && (
                        <FiPackage className="text-primary-600" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-4 flex gap-2">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 border-2 border-gray-200 py-2 rounded-full font-semibold hover:border-primary-500 hover:text-primary-600 transition text-sm"
                >
                  السابق
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedAddress) ||
                    (step === 2 && !selectedShipping)
                  }
                  className="flex-1 bg-primary-600 text-white py-2 rounded-full font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading || !selectedPayment}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-full font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
              address={selectedAddress}
              shipping={selectedShipping}
              payment={paymentMethods.find(m => m.id === selectedPayment)}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
