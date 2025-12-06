'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pages/privacy`)
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
              {content?.title || 'سياسة الخصوصية'}
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
    <p class="mb-4">نحن في <strong>أبعاد التواصل</strong> نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">المعلومات التي نجمعها</h2>
    <p class="mb-4">عند استخدامك لموقعنا، قد نجمع المعلومات التالية:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>الاسم الكامل</li>
      <li>عنوان البريد الإلكتروني</li>
      <li>رقم الهاتف</li>
      <li>عنوان التوصيل</li>
      <li>معلومات الدفع (مشفرة)</li>
      <li>سجل المشتريات</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">كيف نستخدم معلوماتك</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>معالجة وتنفيذ طلباتك</li>
      <li>التواصل معك بخصوص طلباتك</li>
      <li>تحسين خدماتنا ومنتجاتنا</li>
      <li>إرسال العروض والتحديثات (بموافقتك)</li>
      <li>منع الاحتيال وتأمين الموقع</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">حماية معلوماتك</h2>
    <p class="mb-4">نستخدم أحدث تقنيات الأمان لحماية بياناتك:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>تشفير SSL لجميع المعاملات</li>
      <li>خوادم آمنة ومحمية</li>
      <li>عدم مشاركة بياناتك مع أطراف ثالثة</li>
      <li>الوصول المحدود للبيانات الشخصية</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
    <p class="mb-4">نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. يمكنك تعطيلها من إعدادات المتصفح، لكن قد يؤثر ذلك على بعض الوظائف.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">حقوقك</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>الوصول إلى بياناتك الشخصية</li>
      <li>تصحيح أو تحديث بياناتك</li>
      <li>حذف حسابك وبياناتك</li>
      <li>إلغاء الاشتراك في النشرات البريدية</li>
      <li>الاعتراض على معالجة بياناتك</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">مشاركة المعلومات</h2>
    <p class="mb-4">لن نشارك معلوماتك الشخصية مع أي طرف ثالث إلا في الحالات التالية:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>شركات الشحن (فقط معلومات التوصيل)</li>
      <li>معالجات الدفع (معلومات مشفرة)</li>
      <li>عند الطلب القانوني من الجهات المختصة</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">التحديثات على السياسة</h2>
    <p class="mb-4">قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">تواصل معنا</h2>
    <p class="mb-4">إذا كان لديك أي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>البريد الإلكتروني: info@abaad.sa</li>
      <li>الهاتف: +966 50 123 4567</li>
    </ul>
    
    <div class="bg-blue-50 border-r-4 border-blue-600 p-4 mt-8">
      <p class="font-bold text-blue-900">آخر تحديث:</p>
      <p class="text-blue-800">يناير 2025</p>
    </div>
  `
}
