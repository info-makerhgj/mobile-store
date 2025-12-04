'use client';

import { useState, useEffect } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface Address {
  id: string;
  _id?: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  building?: string;
  postalCode?: string;
  isDefault: boolean;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    street: '',
    building: '',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/addresses`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAddresses();
        setShowAddForm(false);
        setEditingId(null);
        resetForm();
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('حدث خطأ أثناء حفظ العنوان');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchAddresses();
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('حدث خطأ أثناء حذف العنوان');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchAddresses();
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('حدث خطأ أثناء تعيين العنوان الافتراضي');
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      street: address.street,
      building: address.building || '',
      postalCode: address.postalCode || '',
      isDefault: address.isDefault,
    });
    setEditingId(address.id || address._id || '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      city: '',
      district: '',
      street: '',
      building: '',
      postalCode: '',
      isDefault: false,
    });
  };

  const saudiCities = [
    'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'القصيم',
    'حائل', 'جازان', 'نجران', 'الباحة', 'الجوف', 'عرعر', 'الخبر', 'الظهران',
    'أبها', 'خميس مشيط', 'ينبع', 'الأحساء'
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-center text-gray-500">جاري تحميل العناوين...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">رقم الجوال *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  required
                  dir="ltr"
                  placeholder="05xxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">المدينة *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  required
                >
                  <option value="">اختر المدينة</option>
                  {saudiCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">الحي *</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">الشارع *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">رقم المبنى</label>
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="font-bold">جعل هذا العنوان افتراضي</span>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition"
              >
                {editingId ? 'تحديث العنوان' : 'إضافة العنوان'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-6 border-2 border-gray-300 py-3 rounded-xl font-bold hover:border-primary-600 transition"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddForm(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition mb-6"
        >
          <FiPlus size={20} />
          <span>إضافة عنوان جديد</span>
        </button>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد عناوين محفوظة</h3>
          <p className="text-gray-600">أضف عنوان جديد لتسهيل عملية الشراء</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id || address._id}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-300 transition shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{address.fullName}</h3>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FiCheck size={14} />
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-1" dir="ltr">{address.phone}</p>
                  <p className="text-gray-700 mb-1">
                    {address.street}، {address.district}
                  </p>
                  <p className="text-gray-700 mb-1">{address.city}</p>
                  {address.building && (
                    <p className="text-gray-600 text-sm">مبنى {address.building}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id || address._id || '')}
                    className="flex-1 border-2 border-green-300 text-green-600 py-2 rounded-lg hover:bg-green-50 transition font-bold text-sm"
                  >
                    جعله افتراضي
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 border-2 border-blue-300 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-bold text-sm flex items-center justify-center gap-1"
                >
                  <FiEdit2 size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(address.id || address._id || '')}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
