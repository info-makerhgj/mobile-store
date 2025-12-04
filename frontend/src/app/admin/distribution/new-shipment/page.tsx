'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPackage, FiPlus, FiTrash2, FiSave } from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'

interface Device {
  imei1: string
  imei2: string
  serialNo: string
}

export default function NewShipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    model: '',
    color: '',
    weight: '',
    factoryBoxNo: '',
    notes: ''
  })
  const [devices, setDevices] = useState<Device[]>([
    { imei1: '', imei2: '', serialNo: '' }
  ])

  const addDevice = () => {
    setDevices([...devices, { imei1: '', imei2: '', serialNo: '' }])
  }

  const removeDevice = (index: number) => {
    setDevices(devices.filter((_, i) => i !== index))
  }

  const updateDevice = (index: number, field: keyof Device, value: string) => {
    const updated = [...devices]
    updated[index][field] = value
    setDevices(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من البيانات
    if (!formData.model || !formData.color) {
      alert('الرجاء إدخال الموديل واللون')
      return
    }

    const validDevices = devices.filter(d => d.imei1.trim())
    if (validDevices.length === 0) {
      alert('الرجاء إدخال IMEI واحد على الأقل')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      
      const response = await fetch(`${API_URL}/distribution/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          devices: validDevices
        })
      })

      if (response.ok) {
        alert('تم إضافة الشحنة بنجاح!')
        router.push('/admin/distribution')
      } else {
        const error = await response.json()
        alert(error.error || 'فشل إضافة الشحنة')
      }
    } catch (error) {
      console.error('Error creating shipment:', error)
      alert('حدث خطأ أثناء إضافة الشحنة')
    } finally {
      setLoading(false)
    }
  }

  const pasteIMEIs = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const lines = text.split('\n').filter(line => line.trim())
      
      const newDevices: Device[] = lines.map(line => {
        const parts = line.split(/[\t,]/).map(p => p.trim())
        return {
          imei1: parts[0] || '',
          imei2: parts[1] || '',
          serialNo: parts[2] || ''
        }
      })

      if (newDevices.length > 0) {
        setDevices(newDevices)
        alert(`تم لصق ${newDevices.length} جهاز`)
      }
    } catch (error) {
      alert('فشل اللصق من الحافظة')
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50" dir="rtl">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات الشحنة */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiPackage className="ml-2" />
              معلومات الشحنة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموديل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: Note 16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون *
                </label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: Starry Blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوزن (كجم)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="13.53"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الكرتون من المصنع
                </label>
                <input
                  type="text"
                  value={formData.factoryBoxNo}
                  onChange={(e) => setFormData({ ...formData, factoryBoxNo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="HB20250508DB048"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          {/* الأجهزة */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FiPackage className="ml-2" />
                الأجهزة ({devices.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={pasteIMEIs}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  لصق من Excel
                </button>
                <button
                  type="button"
                  onClick={addDevice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiPlus className="ml-2" />
                  إضافة جهاز
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {devices.map((device, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        IMEI 1 *
                      </label>
                      <input
                        type="text"
                        value={device.imei1}
                        onChange={(e) => updateDevice(index, 'imei1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="350809..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        IMEI 2
                      </label>
                      <input
                        type="text"
                        value={device.imei2}
                        onChange={(e) => updateDevice(index, 'imei2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="350809..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Serial No
                      </label>
                      <input
                        type="text"
                        value={device.serialNo}
                        onChange={(e) => updateDevice(index, 'serialNo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="SN..."
                      />
                    </div>
                  </div>
                  {devices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDevice(index)}
                      className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>نصيحة:</strong> يمكنك نسخ البيانات من Excel (IMEI1, IMEI2, Serial) ولصقها مباشرة
              </p>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FiSave className="ml-2" />
                  حفظ الشحنة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
}
