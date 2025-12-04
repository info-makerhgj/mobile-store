# 🔗 ربط نظام الشحن مع صفحة الطلبات

## نظرة عامة

هذا الدليل يشرح كيفية إضافة اختيار طريقة الشحن في صفحة الطلبات (Checkout).

---

## 📝 الخطوات

### 1️⃣ استيراد المكون

في ملف `frontend/src/app/checkout/page.tsx`:

```tsx
import ShippingSelector from '@/components/ShippingSelector';
```

### 2️⃣ إضافة State

```tsx
const [selectedShipping, setSelectedShipping] = useState<any>(null);
const [shippingCity, setShippingCity] = useState('');
```

### 3️⃣ إضافة المكون في الصفحة

```tsx
{/* بعد قسم العنوان */}
{shippingCity && (
  <ShippingSelector
    city={shippingCity}
    onSelect={(option) => {
      setSelectedShipping(option);
      // تحديث الإجمالي
      const newTotal = cartTotal + option.price;
      setTotal(newTotal);
    }}
    selectedProviderId={selectedShipping?.providerId}
  />
)}
```

### 4️⃣ تحديث حساب الإجمالي

```tsx
const calculateTotal = () => {
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping?.price || 0;
  return cartTotal + shippingCost;
};
```

### 5️⃣ إرسال بيانات الشحن مع الطلب

```tsx
const orderData = {
  items: cart.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  })),
  total: calculateTotal(),
  shippingAddress: {
    fullName: formData.fullName,
    phone: formData.phone,
    city: formData.city,
    district: formData.district,
    street: formData.street,
    building: formData.building,
  },
  paymentMethod: selectedPayment,
  // إضافة معلومات الشحن
  shippingProviderId: selectedShipping?.providerId,
  shippingCost: selectedShipping?.price,
};
```

---

## 🎨 مثال كامل

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShippingSelector from '@/components/ShippingSelector';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    street: '',
    building: '',
  });

  const calculateTotal = () => {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = selectedShipping?.price || 0;
    return cartTotal + shippingCost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShipping) {
      alert('الرجاء اختيار طريقة الشحن');
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: calculateTotal(),
      shippingAddress: formData,
      paymentMethod: 'cod',
      shippingProviderId: selectedShipping.providerId,
      shippingCost: selectedShipping.price,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="container mx-auto p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* نموذج العنوان */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">عنوان التوصيل</h2>
          {/* حقول النموذج */}
        </div>

        {/* اختيار طريقة الشحن */}
        {formData.city && (
          <ShippingSelector
            city={formData.city}
            onSelect={(option) => setSelectedShipping(option)}
            selectedProviderId={selectedShipping?.providerId}
          />
        )}

        {/* ملخص الطلب */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المنتجات:</span>
              <span>{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} ريال</span>
            </div>
            {selectedShipping && (
              <div className="flex justify-between">
                <span>الشحن ({selectedShipping.providerName}):</span>
                <span>{selectedShipping.price} ريال</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>الإجمالي:</span>
              <span>{calculateTotal()} ريال</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold text-lg"
        >
          تأكيد الطلب
        </button>
      </form>
    </div>
  );
}
```

---

## 🔄 إنشاء الشحنة تلقائياً

في Backend، بعد إنشاء الطلب بنجاح:

```typescript
// في orderController.ts
import { ShippingService } from '../services/ShippingService';

const shippingService = new ShippingService();

// بعد إنشاء الطلب
if (order && shippingProviderId) {
  const shipmentRequest = {
    orderId: order.id,
    providerId: shippingProviderId,
    customerInfo: {
      name: shippingAddress.fullName,
      phone: shippingAddress.phone,
      address: `${shippingAddress.street}, ${shippingAddress.district}`,
      city: shippingAddress.city,
    },
    items: order.items.map(item => ({
      name: item.product.nameAr,
      quantity: item.quantity,
      value: item.price,
    })),
    totalValue: order.total,
    codAmount: paymentMethod === 'cod' ? order.total : 0,
  };

  const shipment = await shippingService.createShipment(shipmentRequest);
  
  if (shipment.success) {
    // حفظ رقم التتبع في الطلب
    await prisma.order.update({
      where: { id: order.id },
      data: { trackingNumber: shipment.trackingNumber },
    });
  }
}
```

---

## 📊 عرض معلومات الشحن في صفحة الطلب

```tsx
// في صفحة تفاصيل الطلب
const [tracking, setTracking] = useState(null);

useEffect(() => {
  if (order.trackingNumber) {
    fetchTracking();
  }
}, [order.trackingNumber]);

const fetchTracking = async () => {
  const response = await fetch(
    `http://localhost:4000/api/shipping/track/${order.trackingNumber}`
  );
  const data = await response.json();
  if (data.success) {
    setTracking(data.tracking);
  }
};

return (
  <div>
    {tracking && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">تتبع الشحنة</h3>
        <div className="space-y-2">
          <p><strong>رقم التتبع:</strong> {tracking.trackingNumber}</p>
          <p><strong>الحالة:</strong> {tracking.statusAr}</p>
          <p><strong>الموقع الحالي:</strong> {tracking.currentLocation}</p>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">سجل الشحنة:</h4>
            <div className="space-y-2">
              {tracking.history.map((event, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <p className="font-medium">{event.statusAr}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString('ar-SA')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
```

---

## ✅ قائمة التحقق

- [ ] تم استيراد `ShippingSelector`
- [ ] تم إضافة state للشحن المختار
- [ ] تم إضافة المكون في الصفحة
- [ ] تم تحديث حساب الإجمالي
- [ ] تم إرسال بيانات الشحن مع الطلب
- [ ] تم إنشاء الشحنة تلقائياً في Backend
- [ ] تم عرض معلومات التتبع

---

## 🎯 النتيجة

الآن لديك:
- ✅ اختيار طريقة الشحن في صفحة الطلبات
- ✅ حساب تلقائي لتكلفة الشحن
- ✅ إنشاء شحنة تلقائياً
- ✅ تتبع الشحنات

---

**جاهز للتطبيق!** 🚀
