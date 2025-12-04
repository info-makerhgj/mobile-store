'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FiCheckCircle, FiBox, FiPackage } from 'react-icons/fi'
import Image from 'next/image'

interface Device {
  imei1: string
  imei2: string | null
  serialNo: string | null
}

interface GroupData {
  groupCode: string
  model: string
  color: string
  quantity: number
  clientName: string
  devices: Device[]
  createdAt: string
}

export default function VerifyGroupPage() {
  const params = useParams()
  const [group, setGroup] = useState<GroupData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchGroup()
  }, [params.groupCode])

  const fetchGroup = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      
      const response = await fetch(
        `${API_URL}/distribution/verify/${params.groupCode}`
      )

      if (response.ok) {
        setGroup(await response.json())
      } else {
        setError(true)
      }
    } catch (error) {
      console.error('Error fetching group:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري التحقق...</p>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">رمز غير صحيح</h1>
          <p className="text-gray-600">
            الرجاء التحقق من الرمز والمحاولة مرة أخرى
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
            <Image
              src="/logo.png"
              alt="أبعاد التواصل"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            منتج موثق ✓
          </h1>
          <p className="text-gray-600">
            تم التحقق من المنتج بنجاح
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <FiCheckCircle className="text-6xl" />
            </div>
            <h2 className="text-2xl font-bold text-center">
              موثق من أبعاد التواصل
            </h2>
            <p className="text-center text-green-100 mt-2">
              وكيل معتمد - المملكة العربية السعودية 🇸🇦
            </p>
          </div>

          {/* Product Info */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FiBox className="text-2xl text-blue-600 ml-2" />
                  <p className="text-sm text-gray-600">الموديل</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{group.model}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FiPackage className="text-2xl text-purple-600 ml-2" />
                  <p className="text-sm text-gray-600">اللون</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{group.color}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">معلومات المجموعة</h3>
                <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold">
                  {group.quantity} جهاز
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">كود المجموعة:</span>
                  <span className="font-mono font-bold text-gray-900">{group.groupCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العميل:</span>
                  <span className="font-bold text-gray-900">{group.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ التوثيق:</span>
                  <span className="font-bold text-gray-900">
                    {new Date(group.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* IMEI List */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiCheckCircle className="text-green-600 ml-2" />
                قائمة IMEI الموثقة
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {group.devices.map((device, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border-r-4 border-green-500 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">
                        جهاز #{index + 1}
                      </span>
                      <FiCheckCircle className="text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-600">IMEI1:</span>{' '}
                        <span className="font-mono font-bold text-gray-900">
                          {device.imei1}
                        </span>
                      </p>
                      {device.imei2 && (
                        <p className="text-sm">
                          <span className="text-gray-600">IMEI2:</span>{' '}
                          <span className="font-mono font-bold text-gray-900">
                            {device.imei2}
                          </span>
                        </p>
                      )}
                      {device.serialNo && (
                        <p className="text-sm">
                          <span className="text-gray-600">Serial:</span>{' '}
                          <span className="font-mono font-bold text-gray-900">
                            {device.serialNo}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg px-8 py-4">
            <p className="text-sm text-gray-600 mb-1">
              للاستفسارات والدعم
            </p>
            <p className="text-lg font-bold text-blue-600">
              www.ab-tw.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
