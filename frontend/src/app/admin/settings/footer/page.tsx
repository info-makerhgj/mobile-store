'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface FooterSettings {
  brandName: string
  brandTagline: string
  brandDescription: string
  phone: string
  email: string
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
  }
  quickLinks: Array<{ title: string; url: string }>
  supportLinks: Array<{ title: string; url: string }>
  copyright: string
  features: Array<{ icon: string; text: string }>
}

export default function FooterSettingsPage() {
  const { loading: authLoading, isAdmin } = useAdminAuth()
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchSettings()
    }
  }, [authLoading, isAdmin])

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/settings/footer')
      const data = await res.json()
      if (data.success) {
        setSettings(data.footer)
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/settings/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ تم حفظ الإعدادات بنجاح')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('❌ حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const addLink = (type: 'quickLinks' | 'supportLinks') => {
    if (!settings) return
    setSettings({
      ...settings,
      [type]: [...settings[type], { title: '', url: '' }],
    })
  }

  const removeLink = (type: 'quickLinks' | 'supportLinks', index: number) => {
    if (!settings) return
    setSettings({
      ...settings,
      [type]: settings[type].filter((_, i) => i !== index),
    })
  }

  const updateLink = (
    type: 'quickLinks' | 'supportLinks',
    index: number,
    field: 'title' | 'url',
    value: string
  ) => {
    if (!settings) return
    const links = [...settings[type]]
    links[index] = { ...links[index], [field]: value }
    setSettings({ ...settings, [type]: links })
  }

  const addFeature = () => {
    if (!settings) return
    setSettings({
      ...settings,
      features: [...settings.features, { icon: '', text: '' }],
    })
  }

  const removeFeature = (index: number) => {
    if (!settings) return
    setSettings({
      ...settings,
      features: settings.features.filter((_, i) => i !== index),
    })
  }

  const updateFeature = (index: number, field: 'icon' | 'text', value: string) => {
    if (!settings) return
    const features = [...settings.features]
    features[index] = { ...features[index], [field]: value }
    setSettings({ ...settings, features })
  }

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">جاري التحميل...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) return null

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">إعدادات نهاية الصفحة</h1>
            <p className="admin-header-subtitle">تحكم في محتوى وروابط نهاية الصفحة</p>
          </div>
        </div>

        {/* Success Message */}
        {message && <div className="admin-alert admin-alert-success mb-6">{message}</div>}

        <div className="space-y-6">
          {/* Brand Info */}
          <div className="admin-card">
            <h2 className="text-lg font-bold mb-4 text-gray-900">معلومات العلامة التجارية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="admin-input"
                  placeholder="أبعاد التواصل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشعار</label>
                <input
                  type="text"
                  value={settings.brandTagline}
                  onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                  className="admin-input"
                  placeholder="أبعاد جديدة للتواصل التقني"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={settings.brandDescription}
                  onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
                  rows={3}
                  className="admin-input"
                  placeholder="متجرك الموثوق لأحدث الجوالات"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="admin-card">
            <h2 className="text-lg font-bold mb-4 text-gray-900">معلومات التواصل</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="admin-input"
                  placeholder="+966 50 123 4567"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="admin-input"
                  placeholder="info@abaad.sa"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="admin-card">
            <h2 className="text-lg font-bold mb-4 text-gray-900">روابط التواصل الاجتماعي</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={settings.socialMedia.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                    })
                  }
                  className="admin-input"
                  placeholder="https://instagram.com/..."
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="text"
                  value={settings.socialMedia.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                    })
                  }
                  className="admin-input"
                  placeholder="https://twitter.com/..."
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="text"
                  value={settings.socialMedia.facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                    })
                  }
                  className="admin-input"
                  placeholder="https://facebook.com/..."
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">روابط سريعة</h2>
              <button
                onClick={() => addLink('quickLinks')}
                className="admin-btn admin-btn-primary flex items-center gap-2 text-sm"
              >
                <FiPlus size={16} />
                <span>إضافة</span>
              </button>
            </div>
            <div className="space-y-3">
              {settings.quickLinks.map((link, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-16">العنوان:</span>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink('quickLinks', index, 'title', e.target.value)}
                      placeholder="من نحن"
                      className="admin-input flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-16">الرابط:</span>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink('quickLinks', index, 'url', e.target.value)}
                      placeholder="/about"
                      className="admin-input flex-1"
                      dir="ltr"
                    />
                    <button
                      onClick={() => removeLink('quickLinks', index)}
                      className="admin-btn admin-btn-danger px-3"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  {index < settings.quickLinks.length - 1 && <hr className="my-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">روابط الدعم</h2>
              <button
                onClick={() => addLink('supportLinks')}
                className="admin-btn admin-btn-primary flex items-center gap-2 text-sm"
              >
                <FiPlus size={16} />
                <span>إضافة</span>
              </button>
            </div>
            <div className="space-y-3">
              {settings.supportLinks.map((link, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-16">العنوان:</span>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink('supportLinks', index, 'title', e.target.value)}
                      placeholder="سياسة الضمان"
                      className="admin-input flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-16">الرابط:</span>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink('supportLinks', index, 'url', e.target.value)}
                      placeholder="/warranty"
                      className="admin-input flex-1"
                      dir="ltr"
                    />
                    <button
                      onClick={() => removeLink('supportLinks', index)}
                      className="admin-btn admin-btn-danger px-3"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  {index < settings.supportLinks.length - 1 && <hr className="my-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">المميزات (أسفل الصفحة)</h2>
              <button
                onClick={addFeature}
                className="admin-btn admin-btn-primary flex items-center gap-2 text-sm"
              >
                <FiPlus size={16} />
                <span>إضافة</span>
              </button>
            </div>
            <div className="space-y-3">
              {settings.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                    placeholder="🎯"
                    className="admin-input w-16 text-center text-xl"
                  />
                  <input
                    type="text"
                    value={feature.text}
                    onChange={(e) => updateFeature(index, 'text', e.target.value)}
                    placeholder="النص"
                    className="admin-input flex-1"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="admin-btn admin-btn-danger px-3"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="admin-card">
            <h2 className="text-lg font-bold mb-4 text-gray-900">حقوق النشر</h2>
            <input
              type="text"
              value={settings.copyright}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
              className="admin-input"
              placeholder="© 2025 أبعاد التواصل. جميع الحقوق محفوظة"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-primary flex items-center gap-2 px-8"
            >
              <FiSave />
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
