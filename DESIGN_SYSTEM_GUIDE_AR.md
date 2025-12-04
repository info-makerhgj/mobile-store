# 📱 دليل استخدام نظام التصميم الموحد

## 🎯 نظرة عامة

تم إنشاء نظام تصميم موحد لجميع صفحات المشروع لضمان تجربة مستخدم متناسقة على جميع الأجهزة، خاصة الجوال.

---

## 📂 ملفات النظام

### 1. `design-tokens.css`
يحتوي على جميع المتغيرات الأساسية:
- أحجام الخطوط
- المسافات
- الألوان
- الأحجام
- الحواف المستديرة
- الظلال
- الانتقالات

### 2. `mobile-components.css`
يحتوي على المكونات الجاهزة:
- الأزرار
- الكروت
- حقول الإدخال
- الشارات
- التنبيهات
- وغيرها...

---

## 🎨 كيفية الاستخدام

### الأزرار (Buttons)

#### الأحجام:
```tsx
// زر صغير (32px)
<button className="btn btn-sm btn-primary">زر صغير</button>

// زر متوسط (44px) - الافتراضي
<button className="btn btn-md btn-primary">زر متوسط</button>

// زر كبير (48px)
<button className="btn btn-lg btn-primary">زر كبير</button>

// زر بعرض كامل
<button className="btn btn-full btn-primary">زر بعرض كامل</button>

// زر أيقونة فقط
<button className="btn btn-icon btn-primary">
  <FiShoppingCart size={20} />
</button>
```

#### الأنواع:
```tsx
// زر أساسي (بنفسجي)
<button className="btn btn-md btn-primary">أساسي</button>

// زر ثانوي (رمادي)
<button className="btn btn-md btn-secondary">ثانوي</button>

// زر محدد (Outline)
<button className="btn btn-md btn-outline">محدد</button>

// زر شفاف (Ghost)
<button className="btn btn-md btn-ghost">شفاف</button>
```

---

### الكروت (Cards)

```tsx
// كارت صغير
<div className="card card-sm">
  <p>محتوى الكارت</p>
</div>

// كارت متوسط
<div className="card card-md">
  <p>محتوى الكارت</p>
</div>

// كارت كبير
<div className="card card-lg">
  <p>محتوى الكارت</p>
</div>

// كارت منتج (جاهز)
<div className="product-card">
  <div className="product-card-image">
    <img src="..." alt="..." />
  </div>
  <div className="product-card-content">
    <p className="product-card-brand">Apple</p>
    <h3 className="product-card-title">iPhone 15 Pro Max</h3>
    <div className="product-card-footer">
      <span className="product-card-price">4,999 ر.س</span>
      <button className="product-card-add-btn">+</button>
    </div>
  </div>
</div>
```

---

### حقول الإدخال (Inputs)

```tsx
// حقل إدخال عادي
<input type="text" className="input" placeholder="أدخل النص" />

// حقل إدخال صغير
<input type="text" className="input input-sm" placeholder="صغير" />

// حقل إدخال كبير
<input type="text" className="input input-lg" placeholder="كبير" />

// حقل إدخال مع أيقونة
<div className="input-wrapper">
  <input type="email" className="input input-with-icon" placeholder="البريد" />
  <FiMail className="input-icon" size={20} />
</div>

// منطقة نص
<textarea className="textarea" placeholder="اكتب رسالتك..."></textarea>
```

---

### الشارات (Badges)

```tsx
// شارة نجاح (خضراء)
<span className="badge badge-success">مكتمل</span>

// شارة تحذير (صفراء)
<span className="badge badge-warning">قيد المعالجة</span>

// شارة خطأ (حمراء)
<span className="badge badge-error">ملغي</span>

// شارة معلومات (زرقاء)
<span className="badge badge-info">جديد</span>

// شارة أساسية (بنفسجية)
<span className="badge badge-primary">مميز</span>

// شارة رمادية
<span className="badge badge-gray">عادي</span>
```

---

### التنبيهات (Alerts)

```tsx
// تنبيه نجاح
<div className="alert alert-success">
  <FiCheckCircle size={20} />
  <p>تم الحفظ بنجاح!</p>
</div>

// تنبيه تحذير
<div className="alert alert-warning">
  <FiAlertCircle size={20} />
  <p>يرجى التحقق من البيانات</p>
</div>

// تنبيه خطأ
<div className="alert alert-error">
  <FiXCircle size={20} />
  <p>حدث خطأ ما</p>
</div>

// تنبيه معلومات
<div className="alert alert-info">
  <FiInfo size={20} />
  <p>معلومة مهمة</p>
</div>
```

---

### التسميات (Labels)

```tsx
// تسمية عادية
<label className="label">الاسم</label>

// تسمية مطلوبة (مع *)
<label className="label label-required">البريد الإلكتروني</label>
```

---

### الحاويات (Containers)

```tsx
// حاوية متجاوبة مع padding موحد
<div className="container-mobile">
  <p>المحتوى هنا</p>
</div>
```

---

### الشبكات (Grids)

```tsx
// شبكة منتجات متجاوبة
// 2 أعمدة على الجوال
// 3 أعمدة على التابلت
// 4 أعمدة على الديسكتوب
<div className="grid-products">
  <div className="product-card">...</div>
  <div className="product-card">...</div>
  <div className="product-card">...</div>
</div>
```

---

### حالات التحميل (Loading)

```tsx
// دائرة تحميل عادية
<div className="loading-spinner"></div>

// دائرة تحميل صغيرة
<div className="loading-spinner loading-spinner-sm"></div>

// دائرة تحميل كبيرة
<div className="loading-spinner loading-spinner-lg"></div>

// هيكل تحميل للنص
<div className="skeleton skeleton-text"></div>

// هيكل تحميل للعنوان
<div className="skeleton skeleton-title"></div>

// هيكل تحميل للصورة
<div className="skeleton skeleton-image"></div>
```

---

### الفواصل (Dividers)

```tsx
// فاصل رفيع
<div className="divider"></div>

// فاصل سميك
<div className="divider divider-thick"></div>
```

---

## 🎨 استخدام المتغيرات (CSS Variables)

يمكنك استخدام المتغيرات مباشرة في CSS:

```css
.my-component {
  /* الخطوط */
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  line-height: var(--leading-normal);
  
  /* المسافات */
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  gap: var(--space-3);
  
  /* الألوان */
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border-color: var(--color-border-light);
  
  /* الحواف */
  border-radius: var(--radius-md);
  
  /* الظلال */
  box-shadow: var(--shadow-md);
  
  /* الانتقالات */
  transition: all var(--transition-base);
}
```

---

## 📏 أحجام الخطوط

### على الجوال:
- `--text-xs`: 10px (نصوص صغيرة جداً)
- `--text-sm`: 12px (نصوص صغيرة)
- `--text-base`: 14px (نص عادي) ⭐
- `--text-lg`: 16px (نص كبير)
- `--text-xl`: 18px (عناوين صغيرة)
- `--text-2xl`: 20px (عناوين متوسطة)
- `--text-3xl`: 24px (عناوين كبيرة)
- `--text-4xl`: 28px (عناوين رئيسية)

### على التابلت (768px+):
الأحجام تزيد تلقائياً

### على الديسكتوب (1024px+):
الأحجام تزيد أكثر

---

## 📐 المسافات

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px ⭐ (بين الكروت)
- `--space-4`: 16px ⭐ (padding الحاوية)
- `--space-5`: 20px
- `--space-6`: 24px ⭐ (بين الأقسام)
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px
- `--space-16`: 64px

---

## 🎨 الألوان

### الألوان الأساسية:
```css
--color-primary-600: #9333ea  /* اللون الأساسي */
--color-primary-700: #7e22ce  /* عند الـ hover */
```

### ألوان النصوص:
```css
--color-text-primary: #111827    /* نص رئيسي */
--color-text-secondary: #4b5563  /* نص ثانوي */
--color-text-tertiary: #6b7280   /* نص خفيف */
```

### ألوان الخلفيات:
```css
--color-bg-primary: #ffffff    /* خلفية بيضاء */
--color-bg-secondary: #fafafa  /* خلفية رمادية فاتحة */
```

### ألوان الحدود:
```css
--color-border-light: #e5e7eb   /* حد فاتح */
--color-border-medium: #d1d5db  /* حد متوسط */
```

---

## 🔄 الحواف المستديرة

- `--radius-sm`: 8px (صغير)
- `--radius-md`: 12px (متوسط) ⭐ الافتراضي
- `--radius-lg`: 16px (كبير)
- `--radius-xl`: 20px (كبير جداً)
- `--radius-2xl`: 24px (ضخم)
- `--radius-full`: 9999px (دائري كامل)

---

## 💡 نصائح مهمة

### 1. استخدم الكلاسات الجاهزة أولاً
```tsx
// ✅ جيد
<button className="btn btn-md btn-primary">زر</button>

// ❌ تجنب
<button className="px-6 py-3 bg-primary-600 rounded-lg">زر</button>
```

### 2. استخدم المتغيرات في CSS المخصص
```css
/* ✅ جيد */
.my-button {
  padding: var(--space-4);
  font-size: var(--text-base);
}

/* ❌ تجنب */
.my-button {
  padding: 16px;
  font-size: 14px;
}
```

### 3. الحد الأدنى لحجم الزر على الجوال
```tsx
// ✅ جيد - 44px ارتفاع
<button className="btn btn-md">زر</button>

// ❌ تجنب - أصغر من 44px
<button className="btn btn-sm">زر</button>
```

### 4. استخدم الشبكات الجاهزة
```tsx
// ✅ جيد
<div className="grid-products">
  {products.map(...)}
</div>

// ❌ تجنب
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
  {products.map(...)}
</div>
```

---

## 📱 أمثلة عملية

### مثال 1: صفحة منتج

```tsx
<div className="container-mobile">
  {/* العنوان */}
  <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>
    iPhone 15 Pro Max
  </h1>
  
  {/* السعر */}
  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
    4,999 ر.س
  </p>
  
  {/* الوصف */}
  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
    أحدث هاتف من آبل مع شريحة A17 Pro
  </p>
  
  {/* الأزرار */}
  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
    <button className="btn btn-lg btn-primary" style={{ flex: 1 }}>
      أضف للسلة
    </button>
    <button className="btn btn-icon-lg btn-outline">
      <FiHeart size={20} />
    </button>
  </div>
</div>
```

### مثال 2: كارت منتج

```tsx
<div className="product-card">
  <div className="product-card-image">
    <img src="/iphone.jpg" alt="iPhone" />
  </div>
  <div className="product-card-content">
    <p className="product-card-brand">Apple</p>
    <h3 className="product-card-title">iPhone 15 Pro Max</h3>
    <div className="product-card-footer">
      <span className="product-card-price">4,999 ر.س</span>
      <button className="product-card-add-btn">
        <FiShoppingCart size={16} />
      </button>
    </div>
  </div>
</div>
```

### مثال 3: نموذج تسجيل دخول

```tsx
<div className="card card-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-6)' }}>
    تسجيل الدخول
  </h2>
  
  <div style={{ marginBottom: 'var(--space-4)' }}>
    <label className="label label-required">البريد الإلكتروني</label>
    <div className="input-wrapper">
      <input type="email" className="input input-with-icon" placeholder="example@email.com" />
      <FiMail className="input-icon" size={20} />
    </div>
  </div>
  
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <label className="label label-required">كلمة المرور</label>
    <div className="input-wrapper">
      <input type="password" className="input input-with-icon" placeholder="••••••••" />
      <FiLock className="input-icon" size={20} />
    </div>
  </div>
  
  <button className="btn btn-full btn-primary">
    تسجيل الدخول
  </button>
</div>
```

---

## ✅ قائمة المراجعة

عند إنشاء صفحة أو مكون جديد، تأكد من:

- [ ] استخدام `container-mobile` للحاوية الرئيسية
- [ ] استخدام أحجام الخطوط من المتغيرات
- [ ] استخدام المسافات من المتغيرات
- [ ] استخدام الأزرار الموحدة (`btn`)
- [ ] استخدام الكروت الموحدة (`card`)
- [ ] استخدام حقول الإدخال الموحدة (`input`)
- [ ] الحد الأدنى لحجم الزر 44px على الجوال
- [ ] اختبار على أحجام شاشات مختلفة
- [ ] التأكد من قابلية القراءة على الجوال
- [ ] التأكد من سهولة النقر على الأزرار

---

## 🚀 البدء السريع

1. **استورد الملفات** (تم بالفعل في `globals.css`):
```css
@import '../styles/design-tokens.css';
@import '../styles/mobile-components.css';
```

2. **استخدم الكلاسات الجاهزة**:
```tsx
<button className="btn btn-md btn-primary">زر</button>
```

3. **أو استخدم المتغيرات**:
```tsx
<div style={{ padding: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
  محتوى
</div>
```

---

**تم إنشاؤه**: 28 نوفمبر 2025
**الحالة**: جاهز للاستخدام ✅
