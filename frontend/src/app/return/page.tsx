'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ReturnPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/pages/return`)
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
              {content?.title || 'سياسة الإرجاع والاستبدال'}
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
    <p class="mb-4">نحن نهتم برضاك التام عن مشترياتك. لذلك نوفر لك سياسة إرجاع واستبدال مرنة.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">مدة الإرجاع والاستبدال</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>يمكنك إرجاع أو استبدال المنتج خلال <strong>7 أيام</strong> من تاريخ الاستلام</li>
      <li>يجب أن يكون المنتج في حالته الأصلية مع جميع الملحقات</li>
      <li>يجب الاحتفاظ بالعلبة الأصلية والفاتورة</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">شروط الإرجاع</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>المنتج لم يتم استخدامه أو تشغيله</li>
      <li>الأختام والملصقات الأصلية سليمة</li>
      <li>جميع الملحقات والهدايا المجانية موجودة</li>
      <li>لا توجد خدوش أو أضرار على المنتج</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">المنتجات غير القابلة للإرجاع</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>المنتجات المخصصة أو المطلوبة حسب الطلب</li>
      <li>بطاقات الشحن والهدايا الإلكترونية</li>
      <li>المنتجات المفتوحة أو المستخدمة</li>
      <li>المنتجات المعروضة بتخفيضات خاصة (ما لم يكن هناك عيب)</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">خطوات الإرجاع</h2>
    <ol class="list-decimal list-inside mb-4 space-y-2">
      <li>تواصل مع خدمة العملاء خلال 7 أيام من الاستلام</li>
      <li>قدم رقم الطلب وسبب الإرجاع</li>
      <li>أعد تغليف المنتج بشكل آمن</li>
      <li>سنرسل لك ممثل لاستلام المنتج</li>
      <li>بعد الفحص، سيتم استرداد المبلغ خلال 5-7 أيام عمل</li>
    </ol>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">الاستبدال</h2>
    <p class="mb-4">يمكنك استبدال المنتج بمنتج آخر من نفس القيمة أو أعلى (مع دفع الفرق). الاستبدال متاح خلال 7 أيام من تاريخ الاستلام.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">استرداد المبلغ</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>سيتم استرداد المبلغ بنفس طريقة الدفع الأصلية</li>
      <li>مدة الاسترداد: 5-7 أيام عمل</li>
      <li>رسوم الشحن غير قابلة للاسترداد</li>
    </ul>
    
    <div class="bg-yellow-50 border-r-4 border-yellow-600 p-4 mt-8">
      <p class="font-bold text-yellow-900">تنبيه:</p>
      <p class="text-yellow-800">في حالة وجود عيب في المنتج، سنتحمل تكاليف الشحن بالكامل.</p>
    </div>
  `
}
