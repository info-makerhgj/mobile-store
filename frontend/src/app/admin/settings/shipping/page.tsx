'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';

interface ShippingProvider {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  apiUrl?: string;
  testMode: boolean;
  settings?: any;
}

export default function ShippingSettings() {
  const router = useRouter();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [providers, setProviders] = useState<ShippingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/shipping/providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = async (providerId: string, updates: Partial<ShippingProvider>) => {
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/shipping/providers/${providerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ تم حفظ التغييرات بنجاح');
        fetchProviders();
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProvider = (provider: ShippingProvider) => {
    updateProvider(provider.id, { enabled: !provider.enabled });
  };

  const handleToggleTestMode = (provider: ShippingProvider) => {
    updateProvider(provider.id, { testMode: !provider.testMode });
  };

  const handleSaveCredentials = (provider: ShippingProvider, formData: any) => {
    updateProvider(provider.id, formData);
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعدادات الشحن</h1>
          <p className="text-gray-600">إدارة شركات الشحن وإعداداتها</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onToggle={handleToggleProvider}
              onToggleTestMode={handleToggleTestMode}
              onSave={handleSaveCredentials}
              saving={saving}
            />
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📋 معلومات مهمة</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• <strong>الوضع التجريبي:</strong> يستخدم بيانات وهمية للاختبار بدون اتصال حقيقي</li>
            <li>• <strong>الوضع الحقيقي:</strong> يتطلب مفاتيح API صحيحة من شركة الشحن</li>
            <li>• <strong>سمسا:</strong> احصل على API Key من حسابك في smsaexpress.com</li>
            <li>• <strong>ريدبكس:</strong> احصل على API Key من حسابك في redboxsa.com</li>
            <li>• <strong>أرامكس:</strong> احصل على Username, Password, Account Number من حسابك</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

function ProviderCard({
  provider,
  onToggle,
  onToggleTestMode,
  onSave,
  saving,
}: {
  provider: ShippingProvider;
  onToggle: (provider: ShippingProvider) => void;
  onToggleTestMode: (provider: ShippingProvider) => void;
  onSave: (provider: ShippingProvider, formData: any) => void;
  saving: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: provider.apiKey || '',
    apiSecret: provider.apiSecret || '',
    apiUrl: provider.apiUrl || '',
    accountNumber: provider.settings?.accountNumber || '',
  });

  const getProviderIcon = () => {
    switch (provider.name) {
      case 'smsa': return '📦';
      case 'redbox': return '🔴';
      case 'aramex': return '✈️';
      default: return '🚚';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {
      apiKey: formData.apiKey,
      apiSecret: formData.apiSecret,
      apiUrl: formData.apiUrl || undefined,
    };
    
    if (provider.name === 'aramex' && formData.accountNumber) {
      updates.settings = { accountNumber: formData.accountNumber };
    }
    
    onSave(provider, updates);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getProviderIcon()}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{provider.displayName}</h3>
              <p className="text-sm text-gray-500">{provider.name.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-600">مفعل</span>
              <input
                type="checkbox"
                checked={provider.enabled}
                onChange={() => onToggle(provider)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            provider.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {provider.enabled ? '✅ مفعل' : '⭕ معطل'}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            provider.testMode ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {provider.testMode ? '🧪 وضع تجريبي' : '🚀 وضع حقيقي'}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {expanded ? '▼ إخفاء الإعدادات' : '▶ عرض الإعدادات'}
        </button>

        {expanded && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={provider.testMode}
                  onChange={() => onToggleTestMode(provider)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">استخدام الوضع التجريبي (بدون اتصال حقيقي)</span>
              </label>
            </div>

            {!provider.testMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key / Username
                  </label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret / Password
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل API Secret"
                  />
                </div>

                {provider.name === 'aramex' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل رقم الحساب"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API URL (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اترك فارغاً لاستخدام الافتراضي"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {saving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
