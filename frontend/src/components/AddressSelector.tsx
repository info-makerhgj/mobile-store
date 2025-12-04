'use client';

import { useState, useEffect } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  building?: string;
  postalCode?: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  onSelect: (address: Address) => void;
  selectedAddressId?: string;
}

export default function AddressSelector({ onSelect, selectedAddressId }: AddressSelectorProps) {
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
      const response = await fetch('http://localhost:4000/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        // اختيار العنوان الافتراضي تلقائياً
        const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress && !selectedAddressId) {
          onSelect(defaultAddress);
        }
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
        ? `http://localhost:4000/api/addresses/${editingId}`
        : 'http://localhost:4000/api/addresses';
      
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
        if (data.address) {
          onSelect(data.address);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
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
    setEditingId(address.id);
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
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-0 mb-4">
        <div className="flex items-center gap-2.5">
          <FiMapPin className="text-primary-600" size={18} />
          <h2 className="text-base md:text-xl font-bold">اختر عنوان التوصيل</h2>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
        >
          <FiPlus size={16} />
          <span>إضافة عنوان جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 md:mb-5 p-3.5 border-2 border-primary-200 rounded-xl bg-primary-50">
          <h3 className="font-semibold text-sm mb-3.5">{editingId ? 'تعديل العنوان' : 'عنوان جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5">الاسم الكامل *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">رقم الجوال *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">المدينة *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                required
              >
                <option value="">اختر المدينة</option>
                {saudiCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">الحي *</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">الشارع *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">رقم المبنى</label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label htmlFor="isDefault" className="text-xs font-semibold">جعل هذا العنوان افتراضي</label>
          </div>
          <div className="mt-3 flex gap-2.5">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 text-sm rounded-xl font-semibold hover:bg-primary-700"
            >
              {editingId ? 'تحديث' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="flex-1 border-2 border-gray-300 py-2 text-sm rounded-xl font-semibold hover:border-primary-600"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiMapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p>لا توجد عناوين محفوظة</p>
          <p className="text-sm">أضف عنوان جديد للمتابعة</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelect(address)}
              className={`p-3.5 border-2 rounded-xl cursor-pointer transition ${
                selectedAddressId === address.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedAddressId === address.id ? 'border-primary-600' : 'border-gray-300'
                  }`}>
                    {selectedAddressId === address.id && (
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm truncate">{address.fullName}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          افتراضي
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{address.phone}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {address.street}، {address.district}، {address.city}
                      {address.building && ` - مبنى ${address.building}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
