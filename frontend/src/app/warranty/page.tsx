'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function WarrantyPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/api/pages/warranty')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.page)
        }
      })
      .catch(err => console.error('Error loading page:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-12" style={{ paddingTop: '100px' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {content?.title || 'سياسة الضمان'}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: content?.content || getDefaultContent() }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function getDefaultContent() {
  return `
    <p class="mb-4">نحن في <strong>أبعاد التواصل</strong> نضمن لك جودة منتجاتنا ونوفر لك ضماناً شاملاً على جميع الأجهزة.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">مدة الضمان</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>الأجهزة الجديدة: ضمان الوكيل لمدة سنة كاملة</li>
      <li>الإكسسوارات: ضمان 6 أشهر من تاريخ الشراء</li>
      <li>الأجهزة المستعملة: ضمان 3 أشهر</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">يشمل الضمان</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>عيوب الصناعة والتشغيل</li>
      <li>مشاكل البطارية (إذا كانت أقل من 80% من السعة الأصلية)</li>
      <li>مشاكل الشاشة (البكسلات الميتة، التشوهات)</li>
      <li>مشاكل الأزرار والمنافذ</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">لا يشمل الضمان</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>الأضرار الناتجة عن سوء الاستخدام</li>
      <li>الكسور والخدوش الخارجية</li>
      <li>أضرار المياه والسوائل</li>
      <li>التعديلات غير المصرح بها</li>
      <li>فقدان أو سرقة الجهاز</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">كيفية المطالبة بالضمان</h2>
    <ol class="list-decimal list-inside mb-4 space-y-2">
      <li>تواصل معنا عبر الهاتف أو البريد الإلكتروني</li>
      <li>قدم فاتورة الشراء ورقم الضمان</li>
      <li>وصف المشكلة بالتفصيل</li>
      <li>سنقوم بفحص الجهاز خلال 48 ساعة</li>
      <li>الإصلاح أو الاستبدال حسب الحالة</li>
    </ol>
    
    <div class="bg-primary-50 border-r-4 border-primary-600 p-4 mt-8">
      <p class="font-bold text-primary-900">ملاحظة مهمة:</p>
      <p class="text-primary-800">يجب الاحتفاظ بفاتورة الشراء الأصلية وعلبة المنتج للمطالبة بالضمان.</p>
    </div>
  `
}
