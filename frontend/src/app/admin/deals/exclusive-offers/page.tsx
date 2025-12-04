'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FiSave, FiRefreshCw } from 'react-icons/fi'

export default function ExclusiveOffersSettings() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [enabled, setEnabled] = useState(true) // خيار إظهار/إخفاء القسم

  // بيانات العروض الثلاثة
  const [offer1, setOffer1] = useState({
    title: 'عرض الجمعة البيضاء',
    titleEn: 'Black Friday Deal',
    discount: '50%',
    description: 'خصم يصل إلى 50% على أجهزة مختارة',
    descriptionEn: 'Up to 50% off on selected devices',
    link: '/deals?category=black-friday',
  })

  const [offer2, setOffer2] = useState({
    title: 'هدية مجانية',
    titleEn: 'Free Gift',
    discount: 'هدية',
    description: 'احصل على سماعات لاسلكية مع كل جهاز',
    descriptionEn: 'Get free wireless earbuds with every device',
    link: '/deals?category=free-gift',
  })

  const [offer3, setOffer3] = useState({
    title: 'عرض محدود',
    titleEn: 'Limited Offer',
    discount: '30%',
    description: 'خصم 30% على الأجهزة الصلبة',
    descriptionEn: '30% off on rugged devices',
    link: '/deals?category=rugged',
  })

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const offersData = { enabled, offer1, offer2, offer3 }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/exclusive-offers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offersData),
      })

      if (response.ok) {
        setMessage('✅ تم حفظ العروض بنجاح!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ حدث خطأ أثناء الحفظ')
      }
    } catch (error) {
      console.error('Error saving offers:', error)
      setMessage('❌ حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('هل تريد استعادة القيم الافتراضية؟')) {
      setEnabled(true)
      setOffer1({
        title: 'عرض الجمعة البيضاء',
        titleEn: 'Black Friday Deal',
        discount: '50%',
        description: 'خصم يصل إلى 50% على أجهزة مختارة',
        descriptionEn: 'Up to 50% off on selected devices',
        link: '/deals?category=black-friday',
      })
      setOffer2({
        title: 'هدية مجانية',
        titleEn: 'Free Gift',
        discount: 'هدية',
        description: 'احصل على سماعات لاسلكية مع كل جهاز',
        descriptionEn: 'Get free wireless earbuds with every device',
        link: '/deals?category=free-gift',
      })
      setOffer3({
        title: 'عرض محدود',
        titleEn: 'Limited Offer',
        discount: '30%',
        description: 'خصم 30% على الأجهزة الصلبة',
        descriptionEn: '30% off on rugged devices',
        link: '/deals?category=rugged',
      })
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/exclusive-offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.enabled !== undefined) setEnabled(data.enabled)
        if (data.offer1) setOffer1(data.offer1)
        if (data.offer2) setOffer2(data.offer2)
        if (data.offer3) setOffer3(data.offer3)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">🔥 إدارة العروض الحصرية</h1>
            <p className="admin-header-subtitle">تحكم في العروض الثلاثة في الصفحة الرئيسية</p>
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
          <h2 className="text-lg font-bold mb-4">معاينة العروض</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* العرض الأول */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">{offer1.title}</h3>
              <p className="text-white/80 text-sm mb-3">{offer1.titleEn}</p>
              <div className="bg-white/90 inline-block px-4 py-2 rounded-full mb-3">
                <span className="text-orange-600 font-bold text-lg">{offer1.discount}</span>
              </div>
              <p className="text-sm mb-1">{offer1.description}</p>
              <p className="text-white/70 text-xs">{offer1.descriptionEn}</p>
            </div>

            {/* العرض الثاني */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">{offer2.title}</h3>
              <p className="text-white/80 text-sm mb-3">{offer2.titleEn}</p>
              <div className="bg-white/90 inline-block px-4 py-2 rounded-full mb-3">
                <span className="text-purple-600 font-bold text-lg">{offer2.discount}</span>
              </div>
              <p className="text-sm mb-1">{offer2.description}</p>
              <p className="text-white/70 text-xs">{offer2.descriptionEn}</p>
            </div>

            {/* العرض الثالث */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">{offer3.title}</h3>
              <p className="text-white/80 text-sm mb-3">{offer3.titleEn}</p>
              <div className="bg-white/90 inline-block px-4 py-2 rounded-full mb-3">
                <span className="text-blue-600 font-bold text-lg">{offer3.discount}</span>
              </div>
              <p className="text-sm mb-1">{offer3.description}</p>
              <p className="text-white/70 text-xs">{offer3.descriptionEn}</p>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {/* Enable/Disable Section */}
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🔌 حالة القسم</h3>
                <p className="text-sm text-gray-600">
                  {enabled ? '✅ القسم نشط ويظهر في الصفحة الرئيسية' : '❌ القسم مخفي ولا يظهر في الصفحة الرئيسية'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                <span className="mr-3 text-sm font-bold text-gray-900">
                  {enabled ? 'مفعّل' : 'معطّل'}
                </span>
              </label>
            </div>
          </div>

          {/* العرض الأول */}
          <div className={`admin-card ${!enabled ? 'opacity-50' : ''}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg"></span>
              العرض الأول (برتقالي)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالعربي *</label>
                <input
                  type="text"
                  value={offer1.title}
                  onChange={(e) => setOffer1({...offer1, title: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="عرض الجمعة البيضاء"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالإنجليزي *</label>
                <input
                  type="text"
                  value={offer1.titleEn}
                  onChange={(e) => setOffer1({...offer1, titleEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="Black Friday Deal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">نسبة الخصم *</label>
                <input
                  type="text"
                  value={offer1.discount}
                  onChange={(e) => setOffer1({...offer1, discount: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="50%"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">الرابط *</label>
                <input
                  type="text"
                  value={offer1.link}
                  onChange={(e) => setOffer1({...offer1, link: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  placeholder="/deals?category=black-friday"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالعربي *</label>
                <textarea
                  value={offer1.description}
                  onChange={(e) => setOffer1({...offer1, description: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                  placeholder="خصم يصل إلى 50% على أجهزة مختارة"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالإنجليزي *</label>
                <textarea
                  value={offer1.descriptionEn}
                  onChange={(e) => setOffer1({...offer1, descriptionEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                  placeholder="Up to 50% off on selected devices"
                />
              </div>
            </div>
          </div>

          {/* العرض الثاني */}
          <div className={`admin-card ${!enabled ? 'opacity-50' : ''}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg"></span>
              العرض الثاني (بنفسجي)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالعربي *</label>
                <input
                  type="text"
                  value={offer2.title}
                  onChange={(e) => setOffer2({...offer2, title: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالإنجليزي *</label>
                <input
                  type="text"
                  value={offer2.titleEn}
                  onChange={(e) => setOffer2({...offer2, titleEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">نسبة الخصم *</label>
                <input
                  type="text"
                  value={offer2.discount}
                  onChange={(e) => setOffer2({...offer2, discount: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">الرابط *</label>
                <input
                  type="text"
                  value={offer2.link}
                  onChange={(e) => setOffer2({...offer2, link: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالعربي *</label>
                <textarea
                  value={offer2.description}
                  onChange={(e) => setOffer2({...offer2, description: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالإنجليزي *</label>
                <textarea
                  value={offer2.descriptionEn}
                  onChange={(e) => setOffer2({...offer2, descriptionEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* العرض الثالث */}
          <div className={`admin-card ${!enabled ? 'opacity-50' : ''}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg"></span>
              العرض الثالث (أزرق)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالعربي *</label>
                <input
                  type="text"
                  value={offer3.title}
                  onChange={(e) => setOffer3({...offer3, title: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالإنجليزي *</label>
                <input
                  type="text"
                  value={offer3.titleEn}
                  onChange={(e) => setOffer3({...offer3, titleEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">نسبة الخصم *</label>
                <input
                  type="text"
                  value={offer3.discount}
                  onChange={(e) => setOffer3({...offer3, discount: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">الرابط *</label>
                <input
                  type="text"
                  value={offer3.link}
                  onChange={(e) => setOffer3({...offer3, link: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالعربي *</label>
                <textarea
                  value={offer3.description}
                  onChange={(e) => setOffer3({...offer3, description: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">الوصف بالإنجليزي *</label>
                <textarea
                  value={offer3.descriptionEn}
                  onChange={(e) => setOffer3({...offer3, descriptionEn: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
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
