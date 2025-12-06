'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    fetch(`${API_URL}/pages/about`)
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
              {content?.title || 'من نحن'}
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
    <p class="mb-4">مرحباً بكم في <strong>أبعاد التواصل</strong>، متجركم الموثوق لأحدث الجوالات والإكسسوارات الأصلية.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">رؤيتنا</h2>
    <p class="mb-4">نسعى لأن نكون الخيار الأول للعملاء في المملكة العربية السعودية عند البحث عن أحدث الأجهزة الذكية والإكسسوارات عالية الجودة.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">مهمتنا</h2>
    <p class="mb-4">توفير تجربة تسوق استثنائية من خلال:</p>
    <ul class="list-disc list-inside mb-4 space-y-2">
      <li>منتجات أصلية 100% مع ضمان الوكيل</li>
      <li>أسعار تنافسية وعروض حصرية</li>
      <li>خدمة عملاء متميزة</li>
      <li>توصيل سريع وآمن</li>
    </ul>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">لماذا نحن؟</h2>
    <p class="mb-4">نتميز بخبرة واسعة في مجال الأجهزة الذكية، ونحرص على اختيار أفضل المنتجات لعملائنا. فريقنا المتخصص جاهز دائماً لمساعدتك في اختيار الجهاز المناسب لاحتياجاتك.</p>
  `
}
