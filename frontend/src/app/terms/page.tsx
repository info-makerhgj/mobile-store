'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/pages/terms`)
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
              {content?.title || 'الشروط والأحكام'}
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
    <p class="mb-4">مرحباً بك في <strong>أبعاد التواصل</strong>. باستخدامك لموقعنا، فإنك توافق على الشروط والأحكام التالية:</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">1. القبول بالشروط</h2>
    <p class="mb-4">باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">2. استخدام الموقع</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>يجب أن تكون بعمر 18 عاماً أو أكثر لإجراء عمليات شراء</li>
      <li>يجب تقديم معلومات صحيحة ودقيقة</li>
      <li>أنت مسؤول عن الحفاظ على سرية حسابك</li>
      <li>يحظر استخدام الموقع لأي أغراض غير قانونية</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">3. الأسعار والدفع</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة</li>
      <li>نحتفظ بالحق في تغيير الأسعار دون إشعار مسبق</li>
      <li>الدفع يتم عند الطلب أو عند الاستلام (حسب الخيار المتاح)</li>
      <li>في حالة رفض الدفع، سيتم إلغاء الطلب</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">4. التوصيل</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>نوفر خدمة التوصيل لجميع مناطق المملكة</li>
      <li>مدة التوصيل: 2-5 أيام عمل</li>
      <li>رسوم التوصيل تختلف حسب المنطقة</li>
      <li>التوصيل مجاني للطلبات فوق 500 ريال</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">5. الملكية الفكرية</h2>
    <p class="mb-4">جميع المحتويات على هذا الموقع (النصوص، الصور، الشعارات) محمية بحقوق الملكية الفكرية. يحظر نسخها أو استخدامها دون إذن كتابي.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">6. إلغاء الطلبات</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>يمكنك إلغاء الطلب قبل الشحن مجاناً</li>
      <li>بعد الشحن، يمكنك رفض الاستلام وسيتم استرداد المبلغ (خصم رسوم الشحن)</li>
      <li>نحتفظ بالحق في إلغاء أي طلب لأسباب أمنية أو قانونية</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">7. المسؤولية</h2>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>نبذل قصارى جهدنا لضمان دقة المعلومات على الموقع</li>
      <li>لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام الموقع</li>
      <li>لا نتحمل مسؤولية التأخير في التوصيل بسبب ظروف خارجة عن إرادتنا</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">8. النزاعات</h2>
    <p class="mb-4">في حالة وجود أي نزاع، سيتم حله وفقاً لأنظمة المملكة العربية السعودية. المحاكم السعودية هي المختصة بالنظر في أي نزاع.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">9. التعديلات</h2>
    <p class="mb-4">نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. التعديلات تصبح سارية فور نشرها على الموقع.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">10. التواصل</h2>
    <p class="mb-4">لأي استفسارات حول الشروط والأحكام، يمكنك التواصل معنا:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>البريد الإلكتروني: info@abaad.sa</li>
      <li>الهاتف: +966 50 123 4567</li>
      <li>العنوان: الرياض، المملكة العربية السعودية</li>
    </ul>
    
    <div class="bg-gray-100 border-r-4 border-gray-600 p-4 mt-8">
      <p class="font-bold text-gray-900">تاريخ السريان:</p>
      <p class="text-gray-800">يناير 2025</p>
    </div>
  `
}
