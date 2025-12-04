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
  const [codSettings, setCodSettings] = useState<any>({ fee: 0, feeType: 'fixed' });

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
      
      console.log('Payment methods response:', data);
      
      if (data.success) {
        const enabledMethods = data.methods.filter((m: any) => m.enabled);
        
        console.log('Enabled methods:', enabledMethods);
        
        // حفظ إعدادات COD
        const codMethod = data.methods.find((m: any) => m.id === 'cod');
        if (codMethod && codMethod.config) {
          setCodSettings({
            fee: parseFloat(codMethod.config.fee || 0),
            feeType: codMethod.config.feeType || 'fixed'
          });
          console.log('COD settings:', { fee: codMethod.config.fee, feeType: codMethod.config.feeType });
        }
        
        setPaymentMethods(enabledMethods);
        
        // اختيار أول طريقة مفعلة
        if (enabledMethods.length > 0) {
          setSelectedPayment(enabledMethods[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  // حساب الأسعار
  const subtotal = cartTotal;
  // إذا ما اختار شركة شحن، نحط 0 (يُحسب لاحقاً)
  // إذا اختار شركة شحن وسعرها 0، نحط -1 (مجاني)
  const shippingCost = selectedShipping ? (selectedShipping.price === 0 ? -1 : selectedShipping.price) : 0;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  
  // حساب رسوم COD
  let codFee = 0;
  if (selectedPayment === 'cod') {
    if (codSettings.feeType === 'percentage') {
      codFee = Math.round(subtotal * (codSettings.fee / 100) * 100) / 100;
    } else {
      codFee = codSettings.fee;
    }
  }
  
  const total = subtotal + (shippingCost === -1 ? 0 : shippingCost) + tax + codFee;

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
      
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName || selectedAddress.name,
          phone: selectedAddress.phone,
          email: selectedAddress.email || '',
          city: selectedAddress.city,
          district: selectedAddress.district || selectedAddress.neighborhood,
          street: selectedAddress.street || selectedAddress.address,
          buildingNumber: selectedAddress.buildingNumber || '',
          additionalInfo: selectedAddress.additionalInfo || selectedAddress.notes || '',
        },
        paymentMethod: selectedPayment,
        customerNotes: '',
      };
      
      // إذا كانت طريقة الدفع Tap، لا نُنشئ الطلب الآن
      // نحفظ البيانات مؤقتاً ونذهب للدفع مباشرة
      if (selectedPayment === 'tap') {
        console.log('💳 Tap payment selected - saving order data temporarily');
        
        // حفظ بيانات الطلب مؤقتاً مع جميع التفاصيل
        // نحفظ userId أيضاً لربط الطلب بالعميل بعد الدفع
        const pendingOrderData = {
          ...orderPayload,
          total,
          subtotal,
          shippingCost: shippingCost === -1 ? 0 : shippingCost,
          tax,
          codFee,
          discount: 0,
          timestamp: Date.now(),
          // حفظ userId من token
          _userId: token ? JSON.parse(atob(token.split('.')[1])).userId : null,
        };
        
        console.log('💾 Saving pending order:', pendingOrderData);
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrderData));
        
        // التحقق من الحفظ
        const saved = localStorage.getItem('pendingOrder');
        console.log('✅ Verified saved data:', saved ? 'Saved successfully' : 'FAILED TO SAVE!');
        
        // إنشاء عملية دفع مباشرة بدون إنشاء طلب
        const tapResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/tap/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: total,
            currency: 'SAR',
            customerName: selectedAddress.fullName || selectedAddress.name,
            customerEmail: selectedAddress.email || 'customer@example.com',
            customerPhone: selectedAddress.phone,
          }),
        });

        const tapData = await tapResponse.json();
        console.log('Tap Payment Response:', tapData);

        if (!tapResponse.ok) {
          throw new Error(tapData.message || 'فشل في إنشاء عملية الدفع');
        }

        // توجيه المستخدم إلى صفحة الدفع
        if (tapData.paymentUrl) {
          console.log('✅ Redirecting to Tap payment page...');
          console.log('⚠️ Order will be created AFTER successful payment');
          window.location.href = tapData.paymentUrl;
          return;
        } else {
          throw new Error('لم يتم الحصول على رابط الدفع');
        }
      }
      
      // للدفع عند الاستلام: إنشاء الطلب مباشرة
      console.log('Creating COD order with payload:', orderPayload);
      
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderResponse.json();
      console.log('📦 Order Response:', orderData);

      if (!orderResponse.ok) {
        console.error('❌ Order creation failed:', orderData);
        throw new Error(orderData.message || 'فشل في إنشاء الطلب');
      }

      const orderId = orderData.order?.orderNumber || orderData.orderNumber || 
                     orderData.order?._id || orderData.order?.id || 
                     orderData._id || orderData.id;

      // للدفع عند الاستلام فقط - التوجيه لصفحة التأكيد
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', orderId);
      console.log('   Payment Method:', selectedPayment);
      console.log('   Full Order Data:', JSON.stringify(orderData, null, 2));
      
      if (!orderId) {
        console.error('❌ No order ID found in response!');
        console.error('   Full response:', orderData);
        alert('خطأ: لم يتم الحصول على رقم الطلب. الرجاء المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }
      
      // مسح السلة فقط للدفع عند الاستلام
      if (selectedPayment === 'cod') {
        console.log('🧹 Clearing cart for COD order...');
        clearCart();
      } else {
        console.log('⚠️ Skipping cart clear - waiting for payment confirmation');
      }
      
      console.log('🚀 Redirecting to order-success page...');
      const totalAmount = orderData.order?.total || total;
      const successUrl = `/order-success?orderId=${encodeURIComponent(orderId)}&payment=${encodeURIComponent(selectedPayment)}&total=${totalAmount}`;
      console.log(`   URL: ${successUrl}`);
      console.log(`   Total Amount: ${totalAmount}`);
      
      // تأخير بسيط للتأكد من حفظ البيانات
      setTimeout(() => {
        window.location.href = successUrl;
      }, 100);

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

      <div className="container-mobile" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        <ProgressIndicator currentStep={step} steps={steps} />

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)', gap: 'var(--space-3)' }}>
            <FiAlertCircle size={24} />
            <p style={{ fontWeight: 'var(--font-bold)' }}>{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3" style={{ gap: 'var(--space-6)' }}>
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
              <div className="card card-lg">
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-6)' }}>اختر شركة الشحن</h2>
                
                {shippingOptions.length === 0 ? (
                  <div className="text-center text-gray-500" style={{ padding: 'var(--space-8) 0' }}>
                    <p style={{ fontSize: 'var(--text-base)' }}>لا توجد شركات شحن متاحة لهذه المدينة</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {shippingOptions.map((option) => (
                      <button
                        key={option.providerId}
                        onClick={() => setSelectedShipping(option)}
                        className={`w-full border-2 rounded-xl transition-base flex items-center justify-between ${
                          selectedShipping?.providerId === option.providerId
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                        style={{ padding: 'var(--space-4)' }}
                      >
                        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                          <div className={`rounded-full border-2 flex items-center justify-center ${
                            selectedShipping?.providerId === option.providerId
                              ? 'border-primary-600'
                              : 'border-gray-300'
                          }`} style={{ width: '24px', height: '24px' }}>
                            {selectedShipping?.providerId === option.providerId && (
                              <div className="bg-primary-600 rounded-full" style={{ width: '12px', height: '12px' }} />
                            )}
                          </div>
                          <div className="text-right">
                            <p style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)' }}>{option.providerName}</p>
                            <p className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>
                              التوصيل خلال {option.estimatedDays} {option.estimatedDays === 1 ? 'يوم' : 'أيام'}
                            </p>
                          </div>
                        </div>
                        <span className="text-primary-600" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>
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
              <div className="card card-lg">
                <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <FiCreditCard className="text-primary-600" size={24} />
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>اختر طريقة الدفع</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full border-2 rounded-xl transition-base flex items-center justify-between ${
                        selectedPayment === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                      style={{ padding: 'var(--space-4)' }}
                    >
                      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                        <div className={`rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? 'border-primary-600' : 'border-gray-300'
                        }`} style={{ width: '24px', height: '24px' }}>
                          {selectedPayment === method.id && (
                            <div className="bg-primary-600 rounded-full" style={{ width: '12px', height: '12px' }} />
                          )}
                        </div>
                        <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)' }}>{method.nameAr}</span>
                      </div>
                      {method.id === 'cod' && (
                        <FiPackage className="text-primary-600" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                {/* رسالة تأكيد COD */}
                {selectedPayment === 'cod' && (
                  <div className="alert alert-info" style={{ marginTop: 'var(--space-4)', gap: 'var(--space-3)' }}>
                    <FiPackage size={20} />
                    <div>
                      <p style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                        الدفع عند الاستلام
                      </p>
                      <p style={{ fontSize: 'var(--text-sm)' }}>
                        سيتم الدفع نقداً عند استلام الطلب من مندوب التوصيل
                        {codFee > 0 && ` (تشمل رسوم خدمة ${codFee.toLocaleString()} ر.س)`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex" style={{ marginTop: 'var(--space-6)', gap: 'var(--space-3)' }}>
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="btn btn-outline"
                  style={{ flex: 1, height: 'var(--btn-height-lg)' }}
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
                  className="btn btn-primary"
                  style={{ flex: 1, height: 'var(--btn-height-lg)' }}
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading || !selectedPayment}
                  className="btn btn-primary"
                  style={{ flex: 1, height: 'var(--btn-height-lg)' }}
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
              codFee={codFee}
              total={total}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
