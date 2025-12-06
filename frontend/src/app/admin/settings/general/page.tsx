'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';

export default function GeneralSettings() {
  const router = useRouter();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [taxSettings, setTaxSettings] = useState({
    enabled: true,
    rate: 0.15,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // جلب إعدادات الضريبة
      const taxResponse = await fetch('http://localhost:5000/api/settings/tax', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const taxData = await taxResponse.json();
      if (taxData.success) {
        setTaxSettings(taxData.tax);
      }

      // جلب إعدادات الشحن
      const shippingResponse = await fetch('http://localhost:5000/api/settings/shipping', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const shippingData = await shippingResponse.json();
      if (shippingData.success) {
        setShippingSettings(shippingData.shipping);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTaxSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/settings/tax', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taxSettings),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ تم حفظ إعدادات الضريبة بنجاح');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveShippingSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/settings/shipping', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shippingSettings),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ تم حفظ إعدادات الشحن بنجاح');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات العامة</h1>
          <p className="text-gray-600">إدارة إعدادات المتجر الأساسية</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* إعدادات الضريبة */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">إعدادات الضريبة</h2>
              <p className="text-sm text-gray-600">تحكم في ضريبة القيمة المضافة</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-600">تفعيل الضريبة</span>
              <input
                type="checkbox"
                checked={taxSettings.enabled}
                onChange={(e) => setTaxSettings({ ...taxSettings, enabled: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {taxSettings.enabled && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الضريبة (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxSettings.rate * 100}
                  onChange={(e) => setTaxSettings({ ...taxSettings, rate: parseFloat(e.target.value) / 100 })}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-600">%</span>
                <span className="text-sm text-gray-500">
                  (مثال: 15 = 15%)
                </span>
              </div>
            </div>
          )}

          <button
            onClick={saveTaxSettings}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {saving ? 'جاري الحفظ...' : '💾 حفظ إعدادات الضريبة'}
          </button>
        </div>

        {/* إعدادات الشحن */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">إعدادات الشحن</h2>
            <p className="text-sm text-gray-600">تحكم في خيارات الشحن المجاني</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للشحن المجاني (ريال)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                step="1"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">ريال</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {shippingSettings.freeShippingThreshold > 0 
                ? `الطلبات التي تزيد عن ${shippingSettings.freeShippingThreshold} ريال ستحصل على شحن مجاني`
                : 'أدخل 0 لتعطيل الشحن المجاني'
              }
            </p>
          </div>

          <button
            onClick={saveShippingSettings}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {saving ? 'جاري الحفظ...' : '💾 حفظ إعدادات الشحن'}
          </button>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📋 ملاحظات</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>الضريبة:</strong> يتم حسابها تلقائياً على المجموع الفرعي للطلب</li>
            <li>• <strong>الشحن المجاني:</strong> يتم تطبيقه عندما يتجاوز المجموع الفرعي الحد المحدد</li>
            <li>• <strong>أسعار الشحن:</strong> يتم تحديدها من صفحة إعدادات الشحن حسب كل شركة ومدينة</li>
            <li>• <strong>التطبيق:</strong> التغييرات تطبق فوراً على جميع الطلبات الجديدة</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
