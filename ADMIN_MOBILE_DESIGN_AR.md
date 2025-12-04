# 📱 دليل تطبيق التصميم الموحد على صفحات الأدمن

## 🎯 المشكلة
صفحات الأدمن السبع غير متوافقة مع الجوال وتحتاج تصميم موحد.

## ✅ الحل
تم إنشاء نظام تصميم موحد خاص بلوحة التحكم في ملف:
```
frontend/src/styles/admin-design-system.css
```

## 📋 الصفحات المطلوب تحديثها

1. ✅ `/admin` - الداشبورد الرئيسي
2. ⏳ `/admin/products` - إدارة المنتجات
3. ⏳ `/admin/orders` - إدارة الطلبات
4. ⏳ `/admin/customers` - إدارة العملاء
5. ⏳ `/admin/deals` - إدارة العروض
6. ⏳ `/admin/homepage-builder` - بناء الصفحة الرئيسية
7. ⏳ `/admin/settings` - الإعدادات

---

## 🎨 المكونات الأساسية

### 1. حاوية الصفحة
```tsx
<div className="admin-page">
  {/* محتوى الصفحة */}
</div>
```

### 2. رأس الصفحة
```tsx
<div className="admin-header">
  <div>
    <h1 className="admin-header-title">إدارة المنتجات</h1>
    <p className="admin-header-subtitle">25 منتج</p>
  </div>
  <div className="admin-header-actions">
    <button className="admin-btn admin-btn-primary">
      <FiPlus size={18} />
      إضافة منتج
    </button>
  </div>
</div>
```

### 3. بطاقات الإحصائيات
```tsx
<div className="admin-stats-grid">
  <div className="admin-stat-card">
    <span className="admin-stat-label">إجمالي المنتجات</span>
    <span className="admin-stat-value">125</span>
  </div>
  <div className="admin-stat-card">
    <span className="admin-stat-label">المبيعات</span>
    <span className="admin-stat-value primary">45,890 ر.س</span>
  </div>
  <div className="admin-stat-card">
    <span className="admin-stat-label">الطلبات</span>
    <span className="admin-stat-value success">234</span>
  </div>
  <div className="admin-stat-card">
    <span className="admin-stat-label">العملاء</span>
    <span className="admin-stat-value warning">1,234</span>
  </div>
</div>
```

### 4. شريط البحث والفلاتر
```tsx
<div className="admin-search-section">
  <div className="admin-search-row">
    <div className="admin-search-input-wrapper">
      <input
        type="text"
        className="admin-search-input"
        placeholder="ابحث عن منتج..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FiSearch className="admin-search-icon" size={20} />
    </div>
    <select className="admin-select">
      <option>جميع الفئات</option>
      <option>جوالات</option>
      <option>ساعات</option>
    </select>
    <select className="admin-select">
      <option>جميع الحالات</option>
      <option>متوفر</option>
      <option>نفذ</option>
    </select>
  </div>
</div>
```

### 5. شبكة البطاقات (للجوال)
```tsx
<div className="admin-cards-grid">
  {items.map((item) => (
    <div key={item.id} className="admin-card">
      {/* محتوى البطاقة */}
    </div>
  ))}
</div>
```

### 6. جدول البيانات (للديسكتوب)
```tsx
<div className="admin-table-wrapper">
  <table className="admin-table">
    <thead>
      <tr>
        <th>العنوان</th>
        <th>القيمة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>بيانات</td>
        <td>قيمة</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 7. الأزرار
```tsx
{/* Primary Button */}
<button className="admin-btn admin-btn-primary">
  <FiPlus size={18} />
  إضافة
</button>

{/* Secondary Button */}
<button className="admin-btn admin-btn-secondary">
  إلغاء
</button>

{/* Outline Button */}
<button className="admin-btn admin-btn-outline">
  تعديل
</button>

{/* Danger Button */}
<button className="admin-btn admin-btn-danger">
  <FiTrash2 size={18} />
  حذف
</button>

{/* Small Button */}
<button className="admin-btn admin-btn-sm admin-btn-primary">
  صغير
</button>

{/* Icon Button */}
<button className="admin-btn-icon admin-btn-primary">
  <FiEdit2 size={18} />
</button>

{/* Full Width Button */}
<button className="admin-btn admin-btn-full admin-btn-primary">
  بعرض كامل
</button>
```

### 8. الشارات
```tsx
<span className="admin-badge admin-badge-success">نشط</span>
<span className="admin-badge admin-badge-warning">قيد المعالجة</span>
<span className="admin-badge admin-badge-danger">ملغي</span>
<span className="admin-badge admin-badge-info">جديد</span>
<span className="admin-badge admin-badge-primary">مميز</span>
<span className="admin-badge admin-badge-gray">عادي</span>
```

### 9. التنبيهات
```tsx
<div className="admin-alert admin-alert-success">
  <FiCheckCircle size={20} />
  <p>تم الحفظ بنجاح!</p>
</div>

<div className="admin-alert admin-alert-warning">
  <FiAlertCircle size={20} />
  <p>يرجى التحقق من البيانات</p>
</div>

<div className="admin-alert admin-alert-danger">
  <FiXCircle size={20} />
  <p>حدث خطأ ما</p>
</div>
```

### 10. حالة التحميل
```tsx
<div className="admin-loading">
  <div className="admin-spinner"></div>
  <p className="admin-loading-text">جاري التحميل...</p>
</div>
```

### 11. حالة فارغة
```tsx
<div className="admin-empty">
  <div className="admin-empty-icon">📦</div>
  <h3 className="admin-empty-title">لا توجد منتجات</h3>
  <p className="admin-empty-text">ابدأ بإضافة منتج جديد</p>
</div>
```

---

## 📱 مثال كامل: صفحة إدارة المنتجات

```tsx
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">إدارة المنتجات</h1>
            <p className="admin-header-subtitle">{products.length} منتج</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn admin-btn-primary">
              <FiPlus size={18} />
              إضافة منتج
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي المنتجات</span>
            <span className="admin-stat-value">125</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">متوفر</span>
            <span className="admin-stat-value success">98</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">نفذت الكمية</span>
            <span className="admin-stat-value danger">27</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي القيمة</span>
            <span className="admin-stat-value primary">245,890 ر.س</span>
          </div>
        </div>

        {/* Search */}
        <div className="admin-search-section">
          <div className="admin-search-row">
            <div className="admin-search-input-wrapper">
              <input
                type="text"
                className="admin-search-input"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="admin-search-icon" size={20} />
            </div>
            <select className="admin-select">
              <option>جميع الفئات</option>
              <option>جوالات</option>
              <option>ساعات</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">جاري تحميل المنتجات...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <h3 className="admin-empty-title">لا توجد منتجات</h3>
            <p className="admin-empty-text">ابدأ بإضافة منتج جديد</p>
          </div>
        )}

        {/* Cards Grid (Mobile) */}
        {!loading && products.length > 0 && (
          <>
            {/* على الجوال - نعرض كروت */}
            <div className="admin-cards-grid md:hidden">
              {products.map((product) => (
                <div key={product.id} className="admin-card">
                  <div className="admin-flex admin-items-center admin-gap-3 admin-mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="admin-font-bold">{product.name}</h3>
                      <p className="admin-text-sm admin-text-gray">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="admin-flex admin-justify-between admin-mb-4">
                    <div>
                      <p className="admin-text-sm admin-text-gray">السعر</p>
                      <p className="admin-font-bold admin-text-primary">
                        {product.price} ر.س
                      </p>
                    </div>
                    <div>
                      <p className="admin-text-sm admin-text-gray">المخزون</p>
                      <p className="admin-font-bold">{product.stock}</p>
                    </div>
                  </div>

                  <div className="admin-flex admin-gap-2">
                    <button className="admin-btn admin-btn-sm admin-btn-outline flex-1">
                      <FiEdit2 size={16} />
                      تعديل
                    </button>
                    <button className="admin-btn-icon-sm admin-btn-danger">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* على الديسكتوب - نعرض جدول */}
            <div className="hidden md:block admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>الفئة</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-flex admin-items-center admin-gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="admin-font-bold">{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td className="admin-font-bold">{product.price} ر.س</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`admin-badge ${
                          product.stock > 0 
                            ? 'admin-badge-success' 
                            : 'admin-badge-danger'
                        }`}>
                          {product.stock > 0 ? 'متوفر' : 'نفذ'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-flex admin-gap-2">
                          <button className="admin-btn-icon-sm admin-btn-outline">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="admin-btn-icon-sm admin-btn-danger">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
```

---

## 🎯 خطوات التطبيق

### 1. استبدل الكلاسات القديمة بالجديدة

#### قبل:
```tsx
<div className="p-6">
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">العنوان</h1>
    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">
      زر
    </button>
  </div>
</div>
```

#### بعد:
```tsx
<div className="admin-page">
  <div className="admin-header">
    <h1 className="admin-header-title">العنوان</h1>
    <button className="admin-btn admin-btn-primary">
      زر
    </button>
  </div>
</div>
```

### 2. أضف عرض الكروت للجوال

```tsx
{/* على الجوال */}
<div className="admin-cards-grid md:hidden">
  {items.map(item => (
    <div key={item.id} className="admin-card">
      {/* محتوى البطاقة */}
    </div>
  ))}
</div>

{/* على الديسكتوب */}
<div className="hidden md:block admin-table-wrapper">
  <table className="admin-table">
    {/* الجدول */}
  </table>
</div>
```

### 3. استخدم الأزرار الموحدة

```tsx
{/* قبل */}
<button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
  زر
</button>

{/* بعد */}
<button className="admin-btn admin-btn-primary">
  زر
</button>
```

---

## 📊 جدول المقارنة

| العنصر | القديم | الجديد |
|--------|--------|--------|
| الحاوية | `p-6` | `admin-page` |
| العنوان | `text-2xl font-bold` | `admin-header-title` |
| الزر | `bg-primary-600 px-4 py-2 rounded-lg` | `admin-btn admin-btn-primary` |
| البطاقة | `bg-white rounded-2xl p-6` | `admin-card` |
| الشارة | `px-3 py-1 rounded-full text-xs` | `admin-badge admin-badge-success` |
| حقل الإدخال | `px-4 py-3 border-2 rounded-xl` | `admin-search-input` |

---

## ✅ قائمة المراجعة

عند تحديث كل صفحة، تأكد من:

- [ ] استخدام `admin-page` للحاوية الرئيسية
- [ ] استخدام `admin-header` للرأس
- [ ] استخدام `admin-stats-grid` للإحصائيات
- [ ] استخدام `admin-search-section` للبحث
- [ ] إضافة عرض الكروت للجوال (`admin-cards-grid`)
- [ ] إضافة عرض الجدول للديسكتوب (`admin-table-wrapper`)
- [ ] استخدام الأزرار الموحدة (`admin-btn`)
- [ ] استخدام الشارات الموحدة (`admin-badge`)
- [ ] إضافة حالة التحميل (`admin-loading`)
- [ ] إضافة حالة فارغة (`admin-empty`)
- [ ] اختبار على الجوال (< 768px)
- [ ] اختبار على التابلت (768px - 1024px)
- [ ] اختبار على الديسكتوب (> 1024px)

---

## 🚀 الخطوات التالية

1. **ابدأ بصفحة واحدة** - جرب على صفحة العملاء أولاً
2. **اختبر على الجوال** - تأكد من التصميم
3. **طبق على باقي الصفحات** - استخدم نفس النمط
4. **راجع وحسّن** - تأكد من الاتساق

---

**تم الإنشاء:** ديسمبر 2024
**الحالة:** ✅ جاهز للتطبيق
