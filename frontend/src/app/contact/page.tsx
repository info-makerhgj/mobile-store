'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setMessage('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (data.success) {
        setMessage('✅ تم إرسال رسالتك بنجاح. سنتواصل معك قريباً')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setMessage('❌ حدث خطأ. حاول مرة أخرى')
      }
    } catch (error) {
      setMessage('❌ حدث خطأ. حاول مرة أخرى')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-12" style={{ paddingTop: '100px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
            <p className="text-gray-600">نحن هنا للإجابة على استفساراتك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {sending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التواصل</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">الهاتف</h3>
                      <p className="text-gray-600" dir="ltr">+966 50 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600" dir="ltr">info@abaad.sa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">العنوان</h3>
                      <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">ساعات العمل</h3>
                      <p className="text-gray-600">السبت - الخميس: 9 صباحاً - 10 مساءً</p>
                      <p className="text-gray-600">الجمعة: 2 ظهراً - 10 مساءً</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">هل تحتاج مساعدة فورية؟</h3>
                <p className="mb-6">تواصل معنا عبر الواتساب للحصول على رد سريع</p>
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  تواصل عبر الواتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
