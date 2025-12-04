'use client'

import { useState } from 'react'
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi'

interface ResponsiveImagePreviewProps {
  imageUrl: string
  alt?: string
}

export default function ResponsiveImagePreview({ imageUrl, alt = 'معاينة' }: ResponsiveImagePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const deviceSizes = {
    desktop: { width: '100%', maxWidth: '1200px', icon: FiMonitor, label: 'ديسكتوب' },
    tablet: { width: '768px', maxWidth: '768px', icon: FiTablet, label: 'تابلت' },
    mobile: { width: '375px', maxWidth: '375px', icon: FiSmartphone, label: 'موبايل' },
  }

  const currentDevice = deviceSizes[device]

  return (
    <div className="admin-card">
      <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
        <h4 className="admin-font-bold">معاينة متجاوبة</h4>
        
        {/* Device Switcher */}
        <div className="admin-flex admin-gap-2">
          {Object.entries(deviceSizes).map(([key, value]) => {
            const Icon = value.icon
            return (
              <button
                key={key}
                onClick={() => setDevice(key as any)}
                className={`admin-btn admin-btn-sm ${
                  device === key ? 'admin-btn-primary' : 'admin-btn-outline'
                }`}
                title={value.label}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{value.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <div
          className="mx-auto transition-all duration-300"
          style={{
            width: currentDevice.width,
            maxWidth: currentDevice.maxWidth,
          }}
        >
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Image */}
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-auto object-cover"
              style={{
                maxHeight: device === 'desktop' ? '600px' : device === 'tablet' ? '500px' : '400px',
              }}
            />

            {/* Size Indicator */}
            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full admin-text-xs admin-font-bold">
              {currentDevice.maxWidth}
            </div>
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="admin-mt-4 admin-flex admin-gap-4 admin-text-sm admin-text-gray">
        <div>
          <span className="admin-font-bold">الحجم:</span> {imageUrl.length > 100 ? 'Base64' : 'URL'}
        </div>
      </div>
    </div>
  )
}
