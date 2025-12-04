'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FiSave, FiRefreshCw } from 'react-icons/fi'

export default function FeaturedDealsSettings() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [settings, setSettings] = useState({
    title: 'عروض حصرية',
    subtitle: 'خصومات تصل إلى {maxDiscount}% على أفضل الأجهزة',
    bannerTitle: 'عروض لفترة محدودة',
    bannerSubtitle: 'لا تفوت الفرصة - العروض تنتهي قريباً',
    productsCount: 6,
    ctaText: 'اكتشف جميع العروض',
  })

  useEffect(() => {
    const saved = localStorage.getItem('featuredDealsSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    setSaving(true)
    setMessage('')

    try {
      localStorage.setItem('featuredDealsSettings', JSON.stringify(settings))
      setMessage('✅ تم حفظ الإعدادات بنجاح!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('هل تريد استعادة القيم الافتراضية؟')) {
      setSettings({
        title: 'عروض حصرية',
        subtitle: 'خصومات تصل إلى {maxDiscount}% على أفضل الأجهزة',
        bannerTitle: 'عروض لفترة محدودة',
        bannerSubtitle: 'لا تفوت الفرصة - العروض تنتهي قريباً',
        productsCount: 6,
        ctaText: 'اكتشف جميع العروض',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">🔥 إدارة قسم العروض المميزة</h1>
            <p className="admin-header-subtitle">تحكم في قسم عرض المنتجات المخفضة</p>
          </div>
          <div className="admin-header-actions">
            <button
              onClick={handleReset}
              className="admin-btn admin-btn-secondary"
            >
              <FiRefreshCw size={18} />
              <span className="hidden md:inline">استعادة الافتراضي</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-success"
            >
              <FiSave size={18} />
              <span className="hidden md:inline">{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`admin-alert ${message.includes('✅') ? 'admin-alert-success' : 'admin-alert-danger'}`}>
            <p>{message}</p>
          </div>
        )}

        {/* Preview */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">معاينة القسم</h2>
          <div className="bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 rounded-2xl p-6">
            {/* Header Preview */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🔥</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {settings.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  {settings.subtitle.replace('{maxDiscount}', '50')}
                </p>
              </div>
            </div>

            {/* Banner Preview */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {settings.bannerTitle}
                  </h3>
                  <p className="text-sm text-white/90">
                    {settings.bannerSubtitle}
                  </p>
                </div>
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-4xl font-bold">50%</div>
                  <div className="text-xs">خصم</div>
                </div>
              </div>
            </div>

            {/* Products Count Info */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600">
                سيتم عرض <span className="font-bold text-primary-600">{settings.productsCount}</span> منتج من المنتجات المخفضة
              </p>
            </div>

            {/* CTA Preview */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold">
                🎁 {settings.ctaText}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Header Settings */}
          <div className="admin-card">
            <h3 className="text-xl font-bold mb-4">⚙️ إعدادات العنوان</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">العنوان الرئيسي *</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({...settings, title: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="عروض حصرية"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">
                  النص الفرعي *
                  <span className="text-xs text-gray-500 font-normal mr-2">
                    (استخدم {'{maxDiscount}'} لعرض أعلى نسبة خصم تلقائياً)
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.subtitle}
                  onChange={(e) => setSettings({...settings, subtitle: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="خصومات تصل إلى {maxDiscount}% على أفضل الأجهزة"
                />
              </div>
            </div>
          </div>

          {/* Banner Settings */}
          <div className="admin-card">
            <h3 className="text-xl font-bold mb-4">🎨 إعدادات البنر</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">عنوان البنر *</label>
                <input
                  type="text"
                  value={settings.bannerTitle}
                  onChange={(e) => setSettings({...settings, bannerTitle: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="عروض لفترة محدودة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">نص البنر الفرعي *</label>
                <input
                  type="text"
                  value={settings.bannerSubtitle}
                  onChange={(e) => setSettings({...settings, bannerSubtitle: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="لا تفوت الفرصة - العروض تنتهي قريباً"
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="admin-card">
            <h3 className="text-xl font-bold mb-4">📊 إعدادات العرض</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">عدد المنتجات المعروضة *</label>
                <select
                  value={settings.productsCount}
                  onChange={(e) => setSettings({...settings, productsCount: parseInt(e.target.value)})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                >
                  <option value={4}>4 منتجات</option>
                  <option value={6}>6 منتجات</option>
                  <option value={8}>8 منتجات</option>
                  <option value={12}>12 منتج</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  سيتم عرض المنتجات المخفضة تلقائياً مرتبة حسب نسبة الخصم
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">نص زر "عرض الكل" *</label>
                <input
                  type="text"
                  value={settings.ctaText}
                  onChange={(e) => setSettings({...settings, ctaText: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="اكتشف جميع العروض"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="admin-alert admin-alert-info mt-6">
          <div>
            <h3 className="font-bold mb-2">💡 معلومات مهمة</h3>
            <ul className="text-sm space-y-1">
              <li>• المنتجات تُعرض تلقائياً من المنتجات التي لها سعر أصلي وسعر مخفض</li>
              <li>• الترتيب يكون حسب نسبة الخصم (الأعلى خصم أولاً)</li>
              <li>• نسبة الخصم في البنر تُحسب تلقائياً من أعلى خصم متوفر</li>
              <li>• لإضافة منتجات للعروض، اذهب لإدارة المنتجات وأضف سعر أصلي وسعر مخفض</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="admin-btn admin-btn-secondary"
          >
            <FiRefreshCw size={18} />
            استعادة الافتراضي
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-success"
          >
            <FiSave size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
