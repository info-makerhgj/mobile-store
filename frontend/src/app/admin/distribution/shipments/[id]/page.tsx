'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FiPackage, FiBox, FiUsers, FiCheck, FiX } from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'

interface Device {
  id: string
  imei1: string
  imei2: string | null
  serialNo: string | null
  status: string
  group: any
}

interface Shipment {
  id: string
  shipmentCode: string
  model: string
  color: string
  totalQuantity: number
  weight: number | null
  factoryBoxNo: string | null
  receivedDate: string
  notes: string | null
  devices: Device[]
  groups: any[]
}

export default function ShipmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchShipment()
  }, [params.id])

  const fetchShipment = async () => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      
      const response = await fetch(
        `${API_URL}/distribution/shipments/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.ok) {
        setShipment(await response.json())
      }
    } catch (error) {
      console.error('Error fetching shipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    )
  }

  const selectAllAvailable = () => {
    if (!shipment) return
    const availableIds = shipment.devices
      .filter(d => d.status === 'IN_STOCK')
      .map(d => d.id)
    setSelectedDevices(availableIds)
  }

  const createGroup = async () => {
    if (!clientName.trim()) {
      alert('الرجاء إدخال اسم العميل')
      return
    }

    if (selectedDevices.length === 0) {
      alert('الرجاء اختيار أجهزة')
      return
    }

    setCreating(true)

    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      
      const response = await fetch(`${API_URL}/distribution/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shipmentId: params.id,
          clientName,
          clientPhone,
          deviceIds: selectedDevices,
          notes
        })
      })

      if (response.ok) {
        alert('تم إنشاء المجموعة بنجاح!')
        setShowCreateGroup(false)
        setClientName('')
        setClientPhone('')
        setNotes('')
        setSelectedDevices([])
        fetchShipment()
      } else {
        const error = await response.json()
        alert(error.error || 'فشل إنشاء المجموعة')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      alert('حدث خطأ أثناء إنشاء المجموعة')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!shipment) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">الشحنة غير موجودة</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const availableDevices = shipment.devices.filter(d => d.status === 'IN_STOCK')

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {shipment.shipmentCode}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {shipment.model} - {shipment.color}
              </p>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              disabled={availableDevices.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUsers className="inline ml-2" />
              إنشاء مجموعة
            </button>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* معلومات الشحنة */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات الشحنة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">الموديل</p>
              <p className="text-lg font-semibold text-gray-900">{shipment.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">اللون</p>
              <p className="text-lg font-semibold text-gray-900">{shipment.color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">الكمية الكلية</p>
              <p className="text-lg font-semibold text-gray-900">{shipment.totalQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">المتاح</p>
              <p className="text-lg font-semibold text-green-600">{availableDevices.length}</p>
            </div>
          </div>
        </div>

        {/* الأجهزة */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              الأجهزة ({shipment.devices.length})
            </h2>
            {showCreateGroup && (
              <button
                onClick={selectAllAvailable}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                تحديد الكل المتاح ({availableDevices.length})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {showCreateGroup && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      اختيار
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    IMEI 1
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    IMEI 2
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Serial
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipment.devices.map((device) => (
                  <tr
                    key={device.id}
                    className={`${
                      device.status !== 'IN_STOCK' ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                    }`}
                  >
                    {showCreateGroup && (
                      <td className="px-6 py-4">
                        {device.status === 'IN_STOCK' && (
                          <input
                            type="checkbox"
                            checked={selectedDevices.includes(device.id)}
                            onChange={() => toggleDevice(device.id)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {device.imei1}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {device.imei2 || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {device.serialNo || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {device.status === 'IN_STOCK' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          متاح
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          مخصص
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* نافذة إنشاء مجموعة */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">إنشاء مجموعة جديدة</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="محل الجوالات"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الجوال
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="أي ملاحظات..."
                />
              </div>

              {/* قائمة الأجهزة المتاحة */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    اختر الأجهزة *
                  </label>
                  <button
                    type="button"
                    onClick={selectAllAvailable}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    تحديد الكل ({availableDevices.length})
                  </button>
                </div>
                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {availableDevices.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      لا توجد أجهزة متاحة
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {availableDevices.map((device) => (
                        <label
                          key={device.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDevices.includes(device.id)}
                            onChange={() => toggleDevice(device.id)}
                            className="w-4 h-4 text-blue-600 rounded ml-3"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-mono text-gray-900">
                              IMEI1: {device.imei1}
                            </p>
                            {device.imei2 && (
                              <p className="text-xs font-mono text-gray-600">
                                IMEI2: {device.imei2}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>الأجهزة المحددة:</strong> {selectedDevices.length}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateGroup(false)
                  setSelectedDevices([])
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={createGroup}
                disabled={creating || selectedDevices.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'جاري الإنشاء...' : 'إنشاء'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}
