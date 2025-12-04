# 🔥 إضافة قسم "عروض حصرية" لنظام إدارة الصفحة الرئيسية

## المشكلة
قسم "عروض حصرية" (ExclusiveOffers) موجود في الصفحة الرئيسية لكن بياناته ثابتة في الكود ومو قابلة للتعديل من لوحة التحكم.

## الحل
إضافة نوع قسم جديد اسمه "exclusiveOffers" لنظام إدارة الصفحة الرئيسية.

---

## الخطوات المطلوبة

### 1. تحديث SectionEditor.tsx

في ملف `frontend/src/components/admin/SectionEditor.tsx`

**أضف الخيار الجديد في السطر 107:**
```tsx
<option value="hero">🎯 بنر رئيسي (Hero Slider)</option>
<option value="categories">📂 فئات المنتجات</option>
<option value="products">📱 عرض منتجات</option>
<option value="banner">🎨 بنر إعلاني</option>
<option value="text">📝 قسم نصي</option>
<option value="imageGrid">🖼️ شبكة صور</option>
<option value="exclusiveOffers">🔥 عروض حصرية</option>  {/* جديد */}
```

**أضف نموذج التعديل (بعد السطر 400 تقريباً):**
```tsx
{/* Exclusive Offers Section */}
{sectionType === 'exclusiveOffers' && (
  <div className="space-y-6">
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">🔥 إعدادات العروض الحصرية</h3>
      
      {/* العرض الأول */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-bold mb-3">العرض الأول (برتقالي)</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-2">العنوان بالعربي</label>
            <input
              type="text"
              value={formData.content.offer1_title || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, offer1_title: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              placeholder="عرض الجمعة البيضاء"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">العنوان بالإنجليزي</label>
            <input
              type="text"
              value={formData.content.offer1_titleEn || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, offer1_titleEn: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              placeholder="Black Friday Deal"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">نسبة الخصم</label>
            <input
              type="text"
              value={formData.content.offer1_discount || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, offer1_discount: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              placeholder="50%"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">الوصف بالعربي</label>
            <textarea
              value={formData.content.offer1_description || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, offer1_description: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              rows={2}
              placeholder="خصم يصل إلى 50% على أجهزة مختارة"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">الرابط</label>
            <input
              type="text"
              value={formData.content.offer1_link || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, offer1_link: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              placeholder="/deals?category=black-friday"
            />
          </div>
        </div>
      </div>

      {/* العرض الثاني */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-bold mb-3">العرض الثاني (بنفسجي)</h4>
        {/* نفس الحقول للعرض الثاني */}
        {/* offer2_title, offer2_titleEn, offer2_discount, offer2_description, offer2_link */}
      </div>

      {/* العرض الثالث */}
      <div className="bg-white rounded-lg p-4">
        <h4 className="font-bold mb-3">العرض الثالث (أزرق)</h4>
        {/* نفس الحقول للعرض الثالث */}
        {/* offer3_title, offer3_titleEn, offer3_discount, offer3_description, offer3_link */}
      </div>
    </div>
  </div>
)}
```

### 2. تحديث SectionPreview.tsx

في ملف `frontend/src/components/admin/SectionPreview.tsx`

**أضف معاينة القسم:**
```tsx
{section.type === 'exclusiveOffers' && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* العرض الأول */}
    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-2">
        {section.content.offer1_title || 'عرض الجمعة البيضاء'}
      </h3>
      <div className="bg-white/90 inline-block px-3 py-1 rounded-full mb-2">
        <span className="text-orange-600 font-bold">
          {section.content.offer1_discount || '50%'}
        </span>
      </div>
      <p className="text-sm">
        {section.content.offer1_description || 'خصم يصل إلى 50% على أجهزة مختارة'}
      </p>
    </div>
    
    {/* العرض الثاني */}
    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-2">
        {section.content.offer2_title || 'هدية مجانية'}
      </h3>
      <div className="bg-white/90 inline-block px-3 py-1 rounded-full mb-2">
        <span className="text-purple-600 font-bold">
          {section.content.offer2_discount || 'هدية'}
        </span>
      </div>
      <p className="text-sm">
        {section.content.offer2_description || 'احصل على سماعات لاسلكية مع كل جهاز'}
      </p>
    </div>
    
    {/* العرض الثالث */}
    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-2">
        {section.content.offer3_title || 'عرض محدود'}
      </h3>
      <div className="bg-white/90 inline-block px-3 py-1 rounded-full mb-2">
        <span className="text-blue-600 font-bold">
          {section.content.offer3_discount || '30%'}
        </span>
      </div>
      <p className="text-sm">
        {section.content.offer3_description || 'خصم 30% على الأجهزة الصلبة'}
      </p>
    </div>
  </div>
)}
```

### 3. تحديث ExclusiveOffers.tsx

في ملف `frontend/src/components/home/ExclusiveOffers.tsx`

**استبدل البيانات الثابتة بجلب من API:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiClock, FiZap, FiGift } from 'react-icons/fi'

export default function ExclusiveOffers() {
  const [offersData, setOffersData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffersData()
  }, [])

  const fetchOffersData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/homepage')
      const data = await response.json()
      
      // ابحث عن قسم العروض الحصرية
      const offersSection = data.sections?.find((s: any) => s.type === 'exclusiveOffers' && s.active)
      
      if (offersSection) {
        setOffersData(offersSection.content)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  // إذا ما فيه بيانات، استخدم البيانات الافتراضية
  const offers = offersData ? [
    {
      id: 1,
      title: offersData.offer1_title || 'عرض الجمعة البيضاء',
      titleEn: offersData.offer1_titleEn || 'Black Friday Deal',
      discount: offersData.offer1_discount || '50%',
      description: offersData.offer1_description || 'خصم يصل إلى 50% على أجهزة مختارة',
      icon: FiZap,
      color: 'from-orange-500 to-red-600',
      link: offersData.offer1_link || '/deals',
    },
    {
      id: 2,
      title: offersData.offer2_title || 'هدية مجانية',
      titleEn: offersData.offer2_titleEn || 'Free Gift',
      discount: offersData.offer2_discount || 'هدية',
      description: offersData.offer2_description || 'احصل على سماعات لاسلكية مع كل جهاز',
      icon: FiGift,
      color: 'from-purple-500 to-pink-600',
      link: offersData.offer2_link || '/deals',
    },
    {
      id: 3,
      title: offersData.offer3_title || 'عرض محدود',
      titleEn: offersData.offer3_titleEn || 'Limited Offer',
      discount: offersData.offer3_discount || '30%',
      description: offersData.offer3_description || 'خصم 30% على الأجهزة الصلبة',
      icon: FiClock,
      color: 'from-blue-500 to-cyan-600',
      link: offersData.offer3_link || '/deals',
    },
  ] : []

  if (loading || offers.length === 0) {
    return null // أو loading spinner
  }

  // باقي الكود نفسه...
}
```

---

## ملاحظات مهمة

1. **الملفات كبيرة جداً** - التعديل يدوي صعب
2. **يحتاج وقت** - تقريباً 30-45 دقيقة للتنفيذ الكامل
3. **الاختبار مهم** - لازم تختبر كل شي بعد التعديل

---

## البديل السريع

إذا تبغى حل سريع، ممكن:
1. أعدل البيانات مباشرة في `ExclusiveOffers.tsx`
2. أو أسوي صفحة إعدادات منفصلة للعروض الحصرية

أي واحد تفضل؟ 🤔
