'use client'

import { useState } from 'react'
import { FiInfo, FiX } from 'react-icons/fi'

interface ImageUploadGuideProps {
  type?: 'banner' | 'product' | 'logo'
}

export default function ImageUploadGuide({ type = 'banner' }: ImageUploadGuideProps) {
  const [showGuide, setShowGuide] = useState(false)

  const guides = {
    banner: {
      title: 'دليل صور البنر',
      sizes: [
        { device: 'الديسكتوب', size: '1920 × 600 بكسل', ratio: '16:5' },
        { device: 'التابلت', size: '1024 × 500 بكسل', ratio: '2:1' },
        { device: 'الموبايل', size: '768 × 400 بكسل', ratio: '2:1' },
      ],
      tips: [
        'استخدم صور عالية الجودة (JPG أو PNG)',
        'حجم الملف المثالي: أقل من 500 كيلوبايت',
        'تجنب النصوص الصغيرة - قد لا تظهر بوضوح على الموبايل',
        'ضع العناصر المهمة في المنتصف (safe zone)',
        'استخدم أدوات ضغط الصور مثل TinyPNG',
      ],
    },
    product: {
      title: 'دليل صور المنتجات',
      sizes: [
        { device: 'الحجم المثالي', size: '800 × 800 بكسل', ratio: '1:1' },
        { device: 'الحد الأدنى', size: '500 × 500 بكسل', ratio: '1:1' },
      ],
      tips: [
        'استخدم خلفية بيضاء أو شفافة',
        'صور المنتج من زوايا متعددة',
        'حجم الملف: أقل من 200 كيلوبايت',
        'تأكد من وضوح تفاصيل المنتج',
      ],
    },
    logo: {
      title: 'دليل الشعار',
      sizes: [
        { device: 'الحجم المثالي', size: '512 × 512 بكسل', ratio: '1:1' },
        { device: 'للهيدر', size: '200 × 60 بكسل', ratio: '10:3' },
      ],
      tips: [
        'استخدم PNG مع خلفية شفافة',
        'حجم الملف: أقل من 100 كيلوبايت',
        'تأكد من وضوح الشعار بأحجام مختلفة',
      ],
    },
  }

  const guide = guides[type]

  return (
    <div className="relative">
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="admin-flex admin-items-center admin-gap-2 admin-text-sm text-primary-600 hover:text-primary-700 admin-font-bold"
      >
        <FiInfo size={16} />
        <span>دليل الأحجام الموصى بها</span>
      </button>

      {showGuide && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowGuide(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Guide Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="admin-card m-4">
              <div className="admin-flex admin-items-center admin-justify-between admin-mb-6">
                <h3 className="admin-text-xl admin-font-bold">{guide.title}</h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="admin-btn-icon-sm admin-btn-outline"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Sizes Table */}
              <div className="admin-mb-6">
                <h4 className="admin-font-bold admin-mb-3">📐 الأحجام الموصى بها</h4>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>الجهاز</th>
                        <th>الحجم</th>
                        <th>النسبة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guide.sizes.map((size, index) => (
                        <tr key={index}>
                          <td className="admin-font-bold">{size.device}</td>
                          <td className="admin-text-primary">{size.size}</td>
                          <td className="admin-text-gray">{size.ratio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips */}
              <div className="admin-mb-6">
                <h4 className="admin-font-bold admin-mb-3">💡 نصائح مهمة</h4>
                <ul className="space-y-2">
                  {guide.tips.map((tip, index) => (
                    <li key={index} className="admin-flex admin-items-start admin-gap-2">
                      <span className="text-green-600 admin-font-bold">✓</span>
                      <span className="admin-text-sm admin-text-gray">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Example */}
              {type === 'banner' && (
                <div className="admin-alert admin-alert-info">
                  <div>
                    <h4 className="admin-font-bold admin-mb-2">📱 التصميم المتجاوب</h4>
                    <p className="admin-text-sm admin-mb-3">
                      الصورة تتكيف تلقائياً مع حجم الشاشة باستخدام:
                    </p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg admin-text-xs font-mono">
                      <div>object-fit: cover;</div>
                      <div>width: 100%;</div>
                      <div>height: auto;</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tools */}
              <div className="admin-alert admin-alert-warning">
                <div>
                  <h4 className="admin-font-bold admin-mb-2">🛠️ أدوات مفيدة</h4>
                  <ul className="admin-text-sm space-y-1">
                    <li>• <strong>TinyPNG</strong> - لضغط الصور</li>
                    <li>• <strong>Canva</strong> - لتصميم البنرات</li>
                    <li>• <strong>Photopea</strong> - محرر صور مجاني</li>
                    <li>• <strong>Remove.bg</strong> - لإزالة الخلفية</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowGuide(false)}
                className="admin-btn admin-btn-primary w-full admin-mt-4"
              >
                فهمت
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
