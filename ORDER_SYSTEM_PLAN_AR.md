# خطة نظام الطلبات الاحترافي 🎯

## التحليل الكامل

### المشاكل الحالية 🔴
1. ❌ الطلب يُنشأ قبل التحقق من كل شيء
2. ❌ لا يوجد تحقق من المخزون
3. ❌ لا يوجد تحقق من العنوان
4. ❌ الدفع غير مرتبط بشكل صحيح
5. ❌ لا يوجد نظام حالات واضح
6. ❌ الطلبات الفاشلة تبقى في النظام

---

## الخطة الجديدة 📋

### المرحلة 1: تحليل المتطلبات ✅

#### 1.1 رحلة العميل (Customer Journey)
```
1. العميل يتصفح المنتجات
2. يضيف منتجات للسلة
3. يذهب للسلة
4. يضغط "إتمام الطلب"
   ↓
5. صفحة الدفع (Checkout):
   - الخطوة 1: معلومات الشحن
     • الاسم الكامل
     • رقم الجوال
     • المدينة
     • الحي
     • الشارع
     • رقم المبنى (اختياري)
     • ملاحظات إضافية (اختياري)
   
   - الخطوة 2: اختيار طريقة الدفع
     • الدفع عند الاستلام (COD)
     • بطاقة ائتمان (Tap)
     • تقسيط (Tabby/Tamara)
     • محفظة إلكترونية (MyFatoorah)
   
   - الخطوة 3: مراجعة الطلب
     • عرض المنتجات
     • عرض العنوان
     • عرض طريقة الدفع
     • عرض الإجمالي
     • زر "تأكيد الطلب"
   ↓
6. معالجة الطلب:
   - التحقق من المخزون
   - التحقق من العنوان
   - حساب الشحن
   - إنشاء الطلب
   ↓
7. الدفع:
   - COD → تأكيد مباشر
   - إلكتروني → توجيه لبوابة الدفع
   ↓
8. النتيجة:
   - نجح → صفحة شكراً + تفاصيل الطلب
   - فشل → رسالة خطأ + إعادة المحاولة
```

---

### المرحلة 2: تصميم قاعدة البيانات 🗄️

#### 2.1 Order Schema
```typescript
{
  _id: ObjectId,
  orderNumber: string,        // #10001
  
  // Customer Info
  userId: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  
  // Items
  items: [
    {
      productId: string,
      productName: string,
      productImage: string,
      quantity: number,
      price: number,
      subtotal: number,
    }
  ],
  
  // Pricing
  subtotal: number,           // مجموع المنتجات
  shippingCost: number,       // تكلفة الشحن
  tax: number,                // الضريبة (15%)
  discount: number,           // الخصم
  total: number,              // الإجمالي النهائي
  
  // Shipping Address
  shippingAddress: {
    fullName: string,
    phone: string,
    city: string,
    district: string,
    street: string,
    buildingNumber: string,
    additionalInfo: string,
  },
  
  // Payment
  paymentMethod: string,      // cod, tap, tabby, tamara, myfatoorah
  paymentStatus: string,      // pending, paid, failed, refunded
  paymentId: string,          // من بوابة الدفع
  
  // Status
  status: string,             // pending, confirmed, processing, shipped, delivered, cancelled
  
  // Tracking
  trackingNumber: string,
  estimatedDelivery: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  
  // Notes
  customerNotes: string,
  adminNotes: string,
  
  // History
  statusHistory: [
    {
      status: string,
      timestamp: Date,
      note: string,
    }
  ]
}
```

---

### المرحلة 3: حالات الطلب (Order States) 🔄

```
1. pending (معلق)
   - الطلب تم إنشاؤه
   - في انتظار الدفع
   - مدة: 15 دقيقة
   - بعدها: يُلغى تلقائياً

2. confirmed (مؤكد)
   - الدفع تم بنجاح
   - جاهز للمعالجة
   - يظهر للعميل والأدمن

3. processing (قيد المعالجة)
   - الأدمن بدأ تجهيز الطلب
   - يتم تحضير المنتجات

4. shipped (تم الشحن)
   - الطلب خرج للتوصيل
   - يوجد رقم تتبع
   - إشعار للعميل

5. delivered (تم التوصيل)
   - الطلب وصل للعميل
   - نهاية الرحلة

6. cancelled (ملغي)
   - تم إلغاء الطلب
   - من العميل أو الأدمن
   - استرجاع المبلغ إن وُجد
```

---

### المرحلة 4: مسار الدفع (Payment Flow) 💳

#### 4.1 الدفع عند الاستلام (COD)
```
1. العميل يختار COD
2. التحقق من:
   ✓ المخزون متوفر
   ✓ العنوان صحيح
   ✓ المبلغ صحيح
3. إنشاء الطلب:
   - status: confirmed
   - paymentStatus: pending
   - paymentMethod: cod
4. إرسال إشعار للعميل
5. إرسال إشعار للأدمن
6. توجيه لصفحة الشكر
```

#### 4.2 الدفع الإلكتروني
```
1. العميل يختار طريقة دفع
2. التحقق من:
   ✓ المخزون متوفر
   ✓ العنوان صحيح
   ✓ المبلغ صحيح
   ✓ طريقة الدفع مفعلة
3. إنشاء الطلب:
   - status: pending
   - paymentStatus: pending
   - paymentMethod: tap/tabby/etc
4. إنشاء جلسة دفع:
   - الاتصال ببوابة الدفع
   - إنشاء رابط الدفع
   - حفظ معرف الجلسة
5. توجيه العميل لبوابة الدفع
6. العميل يدفع:
   ├─ نجح:
   │  - Webhook من البوابة
   │  - تحديث الطلب:
   │    • status: confirmed
   │    • paymentStatus: paid
   │  - إشعار للعميل
   │  - إشعار للأدمن
   │  - توجيه لصفحة الشكر
   │
   └─ فشل/ألغى:
      - Webhook من البوابة
      - تحديث الطلب:
        • status: cancelled
        • paymentStatus: failed
      - إشعار للعميل
      - توجيه لصفحة الفشل
```

---

### المرحلة 5: التحققات (Validations) ✓

#### 5.1 قبل إنشاء الطلب
```typescript
// 1. التحقق من السلة
if (cartItems.length === 0) {
  throw new Error('السلة فارغة')
}

// 2. التحقق من المخزون
for (const item of cartItems) {
  const product = await getProduct(item.productId)
  if (!product) {
    throw new Error(`المنتج ${item.name} غير موجود`)
  }
  if (product.stock < item.quantity) {
    throw new Error(`المنتج ${item.name} غير متوفر بالكمية المطلوبة`)
  }
}

// 3. التحقق من العنوان
if (!shippingAddress.fullName) {
  throw new Error('الاسم الكامل مطلوب')
}
if (!shippingAddress.phone || !isValidPhone(shippingAddress.phone)) {
  throw new Error('رقم الجوال غير صحيح')
}
if (!shippingAddress.city) {
  throw new Error('المدينة مطلوبة')
}

// 4. التحقق من طريقة الدفع
const paymentMethod = await getPaymentMethod(selectedPayment)
if (!paymentMethod || !paymentMethod.enabled) {
  throw new Error('طريقة الدفع غير متاحة')
}

// 5. حساب الإجمالي
const subtotal = calculateSubtotal(cartItems)
const shippingCost = calculateShipping(shippingAddress.city)
const tax = calculateTax(subtotal)
const total = subtotal + shippingCost + tax
```

---

### المرحلة 6: الإشعارات (Notifications) 📧

#### 6.1 للعميل
```
1. تأكيد الطلب:
   - البريد الإلكتروني
   - SMS (اختياري)
   - إشعار في الموقع

2. تحديث الحالة:
   - عند بدء المعالجة
   - عند الشحن (مع رقم التتبع)
   - عند التوصيل

3. تذكيرات:
   - الدفع المعلق (بعد 10 دقائق)
   - تقييم الطلب (بعد التوصيل)
```

#### 6.2 للأدمن
```
1. طلب جديد:
   - إشعار فوري
   - صوت تنبيه
   - عرض في لوحة التحكم

2. دفع ناجح:
   - إشعار
   - تحديث الإحصائيات

3. مشاكل:
   - دفع فاشل
   - طلب ملغي
   - مخزون منخفض
```

---

### المرحلة 7: الأمان (Security) 🔒

```
1. التحقق من المستخدم:
   - JWT Token
   - Session validation
   - Rate limiting

2. التحقق من البيانات:
   - Input sanitization
   - SQL injection prevention
   - XSS prevention

3. التحقق من الدفع:
   - Webhook signature verification
   - Amount validation
   - Duplicate payment prevention

4. حماية API:
   - CORS
   - HTTPS only
   - API key rotation
```

---

### المرحلة 8: معالجة الأخطاء (Error Handling) ⚠️

```typescript
// 1. أخطاء التحقق
class ValidationError extends Error {
  constructor(message: string, field?: string) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

// 2. أخطاء الدفع
class PaymentError extends Error {
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'PaymentError'
    this.code = code
  }
}

// 3. أخطاء المخزون
class StockError extends Error {
  constructor(message: string, productId?: string) {
    super(message)
    this.name = 'StockError'
    this.productId = productId
  }
}

// 4. معالجة عامة
try {
  await createOrder(orderData)
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: error.message, field: error.field }
  }
  if (error instanceof PaymentError) {
    return { success: false, error: error.message, code: error.code }
  }
  if (error instanceof StockError) {
    return { success: false, error: error.message, productId: error.productId }
  }
  // خطأ غير متوقع
  logger.error('Unexpected error:', error)
  return { success: false, error: 'حدث خطأ غير متوقع' }
}
```

---

## الملفات المطلوبة 📁

### Backend
```
backend/src/
├── controllers/
│   ├── orderController.ts          ✅ إعادة كتابة
│   ├── paymentController.ts        ✅ إعادة كتابة
│   └── webhookController.ts        🆕 جديد
├── services/
│   ├── OrderService.ts             🆕 جديد
│   ├── PaymentService.ts           ✅ تحسين
│   ├── ValidationService.ts        🆕 جديد
│   ├── NotificationService.ts      🆕 جديد
│   └── StockService.ts             🆕 جديد
├── models/
│   ├── Order.ts                    🆕 جديد
│   └── OrderStatus.ts              🆕 جديد
├── utils/
│   ├── calculations.ts             🆕 جديد
│   ├── validators.ts               🆕 جديد
│   └── errors.ts                   🆕 جديد
└── routes/
    ├── orders.ts                   ✅ تحديث
    ├── payments.ts                 ✅ تحديث
    └── webhooks.ts                 🆕 جديد
```

### Frontend
```
frontend/src/app/
├── checkout/
│   └── page.tsx                    ✅ إعادة كتابة كاملة
├── orders/
│   └── [id]/
│       └── page.tsx                🆕 صفحة تفاصيل الطلب
├── payment/
│   ├── success/
│   │   └── page.tsx                🆕 صفحة النجاح
│   └── failed/
│       └── page.tsx                🆕 صفحة الفشل
└── account/
    └── page.tsx                    ✅ تحديث
```

---

## الجدول الزمني ⏱️

### المرحلة 1: البنية التحتية (30 دقيقة)
- إنشاء Models
- إنشاء Services
- إنشاء Utils

### المرحلة 2: Backend (45 دقيقة)
- OrderController
- PaymentController
- WebhookController
- Routes

### المرحلة 3: Frontend (45 دقيقة)
- صفحة Checkout جديدة
- صفحات النجاح/الفشل
- تحديث صفحة الطلبات

### المرحلة 4: الاختبار (30 دقيقة)
- اختبار COD
- اختبار الدفع الإلكتروني
- اختبار الأخطاء

**الإجمالي: 2.5 ساعة**

---

## هل توافق على هذه الخطة؟ 🤔

إذا كنت موافق، سأبدأ التنفيذ خطوة بخطوة:
1. ✅ البنية التحتية
2. ✅ Backend
3. ✅ Frontend
4. ✅ الاختبار

**أخبرني إذا تريد تعديل أي شيء في الخطة قبل البدء! 👍**
