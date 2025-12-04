# 🔧 حل مشكلة Hydration Error في Next.js

## 📋 المشكلة

عند فتح الموقع من الجوال، يظهر خطأ:
```
Unhandled Runtime Error
Error: Text content does not match server-rendered HTML.
Warning: Text content did not match.
Server: "1.,..." Client: "10,000"
```

## 🎯 السبب

المشكلة تحدث لأن Next.js يعمل Server-Side Rendering (SSR)، والأرقام تتنسق بطريقة مختلفة على السيرفر عن الكلاينت عند استخدام `toLocaleString()`.

## ✅ الحل المطبق

### 1. تعطيل React Strict Mode
**الملف:** `frontend/next.config.js`

```javascript
const nextConfig = {
  reactStrictMode: false,  // ✅ تم التعطيل
  // ...
}
```

### 2. إضافة suppressHydrationWarning
**الملف:** `frontend/src/app/layout.tsx`

```tsx
<html lang="ar" dir="rtl" suppressHydrationWarning>
  <body suppressHydrationWarning>
    {/* ... */}
  </body>
</html>
```

### 3. تأخير عرض المحتوى حتى يحمل الكلاينت
**الملفات المعدلة:**
- `frontend/src/app/products/page.tsx`
- `frontend/src/app/products/[id]/page.tsx`

```tsx
export default function ProductsPage() {
  // ⚠️ مهم: كل الـ hooks لازم تكون في البداية
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ عرض loading حتى يحمل الكلاينت
  if (!mounted) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container-mobile flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // باقي الكود...
}
```

### 4. إنشاء Price Component
**الملف:** `frontend/src/components/ui/Price.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'

interface PriceProps {
  value: number
  currency?: string
  className?: string
}

export default function Price({ value, currency = 'ر.س', className = '' }: PriceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>{value} {currency}</span>
  }

  return <span className={className}>{value.toLocaleString()} {currency}</span>
}
```

**الاستخدام:**
```tsx
import Price from '@/components/ui/Price'

// بدلاً من:
<span>{product.price.toLocaleString()} ر.س</span>

// استخدم:
<Price value={product.price} />
```

### 5. إصلاح useSearchParams
**الملفات المعدلة:**
- `frontend/src/app/order-success/page.tsx`
- `frontend/src/app/payment/success/page.tsx`
- `frontend/src/app/payment/failed/page.tsx`

```tsx
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams() // ✅ داخل component منفصل
  // ...
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OrderSuccessContent />
    </Suspense>
  )
}
```

### 6. تغيير Image إلى img
**الملفات المعدلة:**
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Footer.tsx`

```tsx
// بدلاً من:
<Image src="/logo.png" alt="..." width={40} height={40} />

// استخدم:
<img src="/logo.png" alt="..." width={40} height={40} className="object-contain" />
```

## 🚀 خطوات إعادة التطبيق

إذا رجعت المشكلة، اتبع هذه الخطوات:

### 1. مسح الـ Cache
```bash
cd frontend
rm -rf .next
npm run dev
```

### 2. التحقق من الملفات
- ✅ `next.config.js` - `reactStrictMode: false`
- ✅ `layout.tsx` - `suppressHydrationWarning`
- ✅ `products/page.tsx` - mounted state
- ✅ `products/[id]/page.tsx` - mounted state

### 3. التحقق من الأرقام
ابحث عن `toLocaleString()` في الملفات واستبدلها بـ `<Price>` component:

```bash
# البحث عن toLocaleString
grep -r "toLocaleString" frontend/src/
```

## ⚠️ ملاحظات مهمة

1. **ترتيب الـ Hooks**: كل الـ `useState` و `useEffect` لازم تكون قبل أي `if` أو `return`
2. **Suspense Boundary**: أي component يستخدم `useSearchParams()` لازم يكون داخل `<Suspense>`
3. **Client-Side Only**: الصفحات اللي فيها مشكلة لازم تستخدم `'use client'` و `mounted` state
4. **Cache**: بعد أي تعديل، امسح `.next` folder

## 📝 الملفات المعدلة

### Config
- `frontend/next.config.js`

### Layout
- `frontend/src/app/layout.tsx`

### Pages
- `frontend/src/app/products/page.tsx`
- `frontend/src/app/products/[id]/page.tsx`
- `frontend/src/app/order-success/page.tsx`
- `frontend/src/app/payment/success/page.tsx`
- `frontend/src/app/payment/failed/page.tsx`

### Components
- `frontend/src/components/ui/Price.tsx` (جديد)
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Footer.tsx`
- `frontend/src/components/product/ProductHero.tsx`
- `frontend/src/components/products/ProductsGrid.tsx`
- `frontend/src/components/products/ProductCard.tsx`

## 🔍 التشخيص السريع

إذا ظهر الخطأ مرة ثانية:

1. افتح Console في المتصفح (F12)
2. شوف الخطأ بالضبط - إيش الـ Server value وإيش الـ Client value
3. ابحث عن هذا الكود في الملفات
4. استبدله بـ `<Price>` component أو أضف `mounted` state

## ✅ التأكد من الحل

```bash
# 1. مسح الـ cache
cd frontend
rm -rf .next

# 2. إعادة التشغيل
npm run dev

# 3. فتح الموقع من الجوال
# افتح: http://192.168.1.111:3000
```

---

**تاريخ التوثيق:** 30 نوفمبر 2025  
**الحالة:** ✅ تم الحل
