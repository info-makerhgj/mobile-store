'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  FiCreditCard,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'

interface PaymentProvider {
  id: string
  name: string
  nameAr: string
  logo: string
  enabled: boolean
  config: {
    apiKey?: string
    secretKey?: string
    merchantId?: string
    publicKey?: string
    [key: string]: any
  }
}

export default function PaymentSettingsPage() {
  const router = useRouter()
  const { loading: authLoading, isAdmin } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({})
  
  const [providers, setProviders] = useState<PaymentProvider[]>([
    {
      id: 'tap',
      name: 'Tap Payments',
      nameAr: 'تاب للدفع',
      logo: '💳',
      enabled: false,
      config: {
        secretKey: '',
        publicKey: '',
        testMode: 'true',
        demoMode: 'false',
      },
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      nameAr: 'الدفع عند الاستلام',
      logo: '📦',
      enabled: true,
      config: {
        fee: '0',
        feeType: 'fixed', // fixed or percentage
      },
    },
  ])

  useEffect(() => {
    if (!isAdmin || authLoading) return

    const fetchSettings = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          if (data.settings) {
            setProviders((prev) =>
              prev.map((provider) => ({
                ...provider,
                enabled: data.settings[provider.id]?.enabled || false,
                config: { ...provider.config, ...data.settings[provider.id]?.config },
              }))
            )
          }
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [router, isAdmin, authLoading])

  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const handleConfigChange = (providerId: string, key: string, value: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, config: { ...p.config, [key]: value } }
          : p
      )
    )
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setSaving(true)
    setMessage(null)

    try {
      for (const provider of providers) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider: provider.id,
            enabled: provider.enabled,
            config: provider.config,
          }),
        })

        if (!res.ok) {
          throw new Error(`فشل حفظ إعدادات ${provider.nameAr}`)
        }
      }

      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء الحفظ' })
    } finally {
      setSaving(false)
    }
  }

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إعدادات الدفع</h1>
          <p className="text-gray-600">إدارة طرق الدفع والمفاتيح السرية</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message.type === 'success' ? (
              <FiCheckCircle size={20} />
            ) : (
              <FiAlertCircle size={20} />
            )}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        {/* Payment Providers */}
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-3xl">
                    {provider.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{provider.nameAr}</h3>
                    <p className="text-sm text-gray-600">{provider.name}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provider.enabled}
                    onChange={() => handleToggleProvider(provider.id)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                  <span className="mr-3 text-sm font-bold text-gray-700">
                    {provider.enabled ? 'مفعل' : 'معطل'}
                  </span>
                </label>
              </div>

              {provider.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  {provider.id === 'tap' ? (
                    // واجهة خاصة لـ Tap Payments
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Secret Key (المفتاح السري)
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets['tap-secretKey'] ? 'text' : 'password'}
                            value={provider.config.secretKey || ''}
                            onChange={(e) =>
                              handleConfigChange(provider.id, 'secretKey', e.target.value)
                            }
                            placeholder="sk_test_..."
                            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowSecret('tap-secretKey')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showSecrets['tap-secretKey'] ? (
                              <FiEyeOff size={20} />
                            ) : (
                              <FiEye size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Public Key (المفتاح العام)
                        </label>
                        <input
                          type="text"
                          value={provider.config.publicKey || ''}
                          onChange={(e) =>
                            handleConfigChange(provider.id, 'publicKey', e.target.value)
                          }
                          placeholder="pk_test_..."
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          وضع التجربة (Demo Mode)
                        </label>
                        <select
                          value={provider.config.demoMode || 'false'}
                          onChange={(e) =>
                            handleConfigChange(provider.id, 'demoMode', e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        >
                          <option value="false">إيقاف (استخدام مفاتيح حقيقية)</option>
                          <option value="true">تفعيل (بدون مفاتيح - للتجربة فقط)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          🎭 وضع التجربة يسمح لك باختبار النظام بدون مفاتيح Tap حقيقية
                        </p>
                      </div>
                      
                      {provider.config.demoMode !== 'true' && (
                        <div>
                          <label className="block text-sm font-bold mb-2">
                            وضع الاختبار
                          </label>
                          <select
                            value={provider.config.testMode || 'true'}
                            onChange={(e) =>
                              handleConfigChange(provider.id, 'testMode', e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                          >
                            <option value="true">تفعيل (Test Mode)</option>
                            <option value="false">إيقاف (Live Mode)</option>
                          </select>
                        </div>
                      )}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-800 mb-2">
                          💡 <strong>كيفية الحصول على المفاتيح:</strong>
                        </p>
                        <ol className="text-sm text-blue-800 space-y-1 mr-4">
                          <li>1. سجل دخول إلى <a href="https://www.tap.company/ar-sa" target="_blank" rel="noopener noreferrer" className="underline font-bold">Tap Dashboard</a></li>
                          <li>2. اذهب إلى Settings → API Keys</li>
                          <li>3. انسخ Secret Key و Public Key</li>
                          <li>4. استخدم Test Keys للتجربة و Live Keys للإنتاج</li>
                        </ol>
                      </div>
                    </>
                  ) : provider.id === 'cod' ? (
                    // واجهة خاصة للدفع عند الاستلام
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          نوع الرسوم
                        </label>
                        <select
                          value={provider.config.feeType || 'fixed'}
                          onChange={(e) =>
                            handleConfigChange(provider.id, 'feeType', e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        >
                          <option value="fixed">مبلغ ثابت (ريال)</option>
                          <option value="percentage">نسبة مئوية (%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          {provider.config.feeType === 'percentage' 
                            ? 'نسبة الرسوم (%)' 
                            : 'رسوم الدفع عند الاستلام (ريال)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step={provider.config.feeType === 'percentage' ? '0.1' : '1'}
                          value={provider.config.fee || '0'}
                          onChange={(e) =>
                            handleConfigChange(provider.id, 'fee', e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {provider.config.feeType === 'percentage'
                            ? 'مثال: 2.5 تعني 2.5% من قيمة الطلب'
                            : 'مثال: 10 تعني 10 ريال رسوم ثابتة'}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          💡 <strong>ملاحظة:</strong> سيتم إضافة هذه الرسوم تلقائياً عند اختيار الدفع عند الاستلام
                        </p>
                      </div>
                    </>
                  ) : (
                    // واجهة عادية لبقية طرق الدفع
                    Object.keys(provider.config).map((key) => {
                      const isSecret = key.toLowerCase().includes('secret') || 
                                     key.toLowerCase().includes('key') ||
                                     key.toLowerCase().includes('token')
                      const fieldKey = `${provider.id}-${key}`
                      
                      return (
                        <div key={key}>
                          <label className="block text-sm font-bold mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="relative">
                            <input
                              type={isSecret && !showSecrets[fieldKey] ? 'password' : 'text'}
                              value={provider.config[key] || ''}
                              onChange={(e) =>
                                handleConfigChange(provider.id, key, e.target.value)
                              }
                              placeholder={`أدخل ${key}`}
                              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleShowSecret(fieldKey)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showSecrets[fieldKey] ? (
                                  <FiEyeOff size={20} />
                                ) : (
                                  <FiEye size={20} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <FiSave size={20} />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FiAlertCircle size={20} className="text-blue-600" />
            معلومات مهمة
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• تأكد من إدخال المفاتيح السرية الصحيحة من لوحة تحكم مزود الدفع</li>
            <li>• استخدم مفاتيح الاختبار (Test Keys) أثناء التطوير</li>
            <li>• قم بتفعيل المفاتيح الحقيقية (Live Keys) عند الإطلاق الفعلي</li>
            <li>• لا تشارك المفاتيح السرية مع أي شخص</li>
            <li>• تأكد من تفعيل Webhook URLs في لوحة تحكم مزود الدفع</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
