'use client';

import { useState, useEffect } from 'react';

interface ShippingOption {
  providerId: string;
  providerName: string;
  price: number;
  estimatedDays: number;
}

interface ShippingSelectorProps {
  city: string;
  onSelect: (option: ShippingOption) => void;
  selectedProviderId?: string;
}

export default function ShippingSelector({ city, onSelect, selectedProviderId }: ShippingSelectorProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      fetchShippingOptions();
    }
  }, [city]);

  const fetchShippingOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/shipping/rates?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (data.success) {
        setOptions(data.rates);
        // اختيار أول خيار تلقائياً
        if (data.rates.length > 0 && !selectedProviderId) {
          onSelect(data.rates[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching shipping options:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">طريقة الشحن</h3>
        <div className="text-center text-gray-500">جاري تحميل خيارات الشحن...</div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">طريقة الشحن</h3>
        <div className="text-center text-gray-500">لا توجد خيارات شحن متاحة لهذه المدينة</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">اختر طريقة الشحن</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.providerId}
            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedProviderId === option.providerId
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                checked={selectedProviderId === option.providerId}
                onChange={() => onSelect(option)}
                className="w-5 h-5 text-blue-600"
              />
              <div>
                <div className="font-bold text-gray-900">{option.providerName}</div>
                <div className="text-sm text-gray-600">
                  التوصيل خلال {option.estimatedDays} {option.estimatedDays === 1 ? 'يوم' : 'أيام'}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {option.price} ريال
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
