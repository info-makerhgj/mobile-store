'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { FiDownload, FiPrinter } from 'react-icons/fi'
import Image from 'next/image'
import QRCode from 'qrcode'
import Barcode from 'react-barcode'

interface Device {
  imei1: string
  imei2: string | null
  serialNo: string | null
}

interface Group {
  id: string
  groupCode: string
  clientName: string
  clientPhone: string | null
  model: string
  color: string
  quantity: number
  qrCode: string
  devices: Device[]
  createdAt: string
}

export default function LabelPage() {
  const params = useParams()
  const [group, setGroup] = useState<Group | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGroup()
  }, [params.id])

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const response = await fetch(
        `${API_URL}/distribution/groups/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setGroup(data)
        
        // توليد QR Code
        if (data.qrCode) {
          const qr = await QRCode.toDataURL(data.qrCode, {
            width: 200,
            margin: 1
          })
          setQrDataUrl(qr)
        }
      }
    } catch (error) {
      console.error('Error fetching group:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const markAsPrinted = async () => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      await fetch(
        `${API_URL}/distribution/groups/${params.id}/printed`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    } catch (error) {
      console.error('Error marking as printed:', error)
    }
  }

  if (loading || !group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Print Buttons - Hidden when printing */}
      <div className="print:hidden bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">ملصق المجموعة</h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiPrinter className="ml-2" />
              طباعة
            </button>
          </div>
        </div>
      </div>

      {/* Label - Shipping Label Size (10cm x 15cm) */}
      <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0 flex items-center justify-center">
        <div className="print:m-0">
          <div
            ref={labelRef}
            className="bg-white shadow-lg print:shadow-none relative flex flex-col"
            style={{
              width: '100mm',
              height: '150mm',
              padding: '2mm',
              fontSize: '7pt'
            }}
            dir="rtl"
          >
            {/* Header - All in One Row */}
            <div className="mb-0.5 pb-0.5 border-b-2 border-gray-800">
              <div className="flex items-center justify-between">
                {/* Right: Product Info */}
                <div className="flex flex-col gap-0 text-[6.5pt] text-right leading-none">
                  <div>
                    <span className="text-gray-600">الموديل:</span>{' '}
                    <span className="font-bold text-gray-900">{group.model}</span>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-gray-600">اللون:</span>{' '}
                    <span className="font-bold text-gray-900">{group.color}</span>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-gray-600">الكمية:</span>{' '}
                    <span className="font-bold text-gray-900">{group.quantity} قطعة</span>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-gray-600">الوزن:</span>{' '}
                    <span className="font-bold text-gray-900">{(group.quantity * 0.2).toFixed(2)} كجم</span>
                  </div>
                </div>

                {/* Center: Logo and Company */}
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={38}
                    height={38}
                    className="h-8 w-auto"
                  />
                  <div className="text-center mt-0.5">
                    <h1 className="text-[9pt] font-bold leading-none text-gray-900">
                      أبعاد التواصل
                    </h1>
                    <p className="text-[5.5pt] text-gray-600 font-semibold leading-none mt-0.5">
                      ABAAD ALTAWASOL
                    </p>
                    <p className="text-[4.5pt] text-gray-500 leading-none mt-0.5">
                      وكيل معتمد - المملكة العربية السعودية
                    </p>
                  </div>
                </div>

                {/* Left: QR Code */}
                {qrDataUrl && (
                  <div className="text-center">
                    <img
                      src={qrDataUrl}
                      alt="QR"
                      className="border-2 border-gray-300 rounded"
                      style={{ width: '70px', height: '70px' }}
                    />
                    <p className="text-[4.5pt] text-gray-500 font-mono leading-none">
                      {group.groupCode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* IMEI List - Rows of 2 Devices Each */}
            <div className="flex-1 space-y-1 text-[5pt] mt-0.5" dir="ltr">
              {Array.from({ length: Math.ceil(group.devices.length / 2) }).map((_, rowIndex) => {
                const device1 = group.devices[rowIndex * 2]
                const device2 = group.devices[rowIndex * 2 + 1]
                
                return (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-1 border-b border-gray-100 pb-1">
                    {/* Device 1 - IMEI1 */}
                    {device1 && (
                      <div key={`${device1.imei1}-1`} className="flex flex-col items-center">
                        <Barcode
                          value={device1.imei1}
                          width={0.6}
                          height={11}
                          fontSize={0}
                          margin={0}
                          displayValue={false}
                        />
                        <p className="font-mono text-[5pt] leading-tight truncate max-w-full px-0.5">
                          IMEI1: {device1.imei1}
                        </p>
                      </div>
                    )}
                    
                    {/* Device 1 - IMEI2 */}
                    {device1?.imei2 && (
                      <div key={`${device1.imei1}-2`} className="flex flex-col items-center">
                        <Barcode
                          value={device1.imei2}
                          width={0.6}
                          height={11}
                          fontSize={0}
                          margin={0}
                          displayValue={false}
                        />
                        <p className="font-mono text-[5pt] leading-tight truncate max-w-full px-0.5">
                          IMEI2: {device1.imei2}
                        </p>
                      </div>
                    )}
                    
                    {/* Device 2 - IMEI1 */}
                    {device2 && (
                      <div key={`${device2.imei1}-1`} className="flex flex-col items-center">
                        <Barcode
                          value={device2.imei1}
                          width={0.6}
                          height={11}
                          fontSize={0}
                          margin={0}
                          displayValue={false}
                        />
                        <p className="font-mono text-[5pt] leading-tight truncate max-w-full px-0.5">
                          IMEI1: {device2.imei1}
                        </p>
                      </div>
                    )}
                    
                    {/* Device 2 - IMEI2 */}
                    {device2?.imei2 && (
                      <div key={`${device2.imei1}-2`} className="flex flex-col items-center">
                        <Barcode
                          value={device2.imei2}
                          width={0.6}
                          height={11}
                          fontSize={0}
                          margin={0}
                          displayValue={false}
                        />
                        <p className="font-mono text-[5pt] leading-tight truncate max-w-full px-0.5">
                          IMEI2: {device2.imei2}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* If more than 30 devices */}
            {group.devices.length > 30 && (
              <div className="text-center mt-0.5 text-[6pt] text-gray-500">
                + {group.devices.length - 30} جهاز
              </div>
            )}

            {/* Footer - Compact */}
            <div className="text-center pt-1 mt-auto border-t-2 border-gray-400" dir="rtl">
              <p className="text-[7pt] font-bold text-gray-900 leading-tight">
                ✓ موثق من أبعاد التواصل
              </p>
              <p className="text-[6pt] text-gray-600 leading-tight">
                وكيل معتمد - المملكة العربية السعودية 🇸🇦
              </p>
              <p className="text-[5pt] text-gray-500 leading-tight">
                {new Date(group.createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: 100mm 150mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </>
  )
}
