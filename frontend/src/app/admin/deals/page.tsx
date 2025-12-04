'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'

interface Deal {
  _id: string
  nameAr: string
  brand: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  stock: number
}

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      const data = await response.json()
      
      const productsList = Array.isArray(data) ? data : (data.products || [])
      
      const dealsProducts = productsList
        .filter((p: any) => p.originalPrice && p.originalPrice > p.price)
        .map((p: any) => ({
          ...p,
          discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        }))
        .sort((a: any, b: any) => b.discount - a.discount)
      
      setDeals(dealsProducts)
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxDiscount = deals.length > 0 ? Math.max(...deals.map(d => d.discount)) : 0
  const avgDiscount = deals.length > 0 
    ? Math.round(deals.reduce((sum, d) => sum + d.discount, 0) / deals.length) 
    : 0
  const totalSavings = deals.reduce((sum, d) => sum + (d.originalPrice - d.price), 0)

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">🔥 إدارة العروض</h1>
            <p className="admin-header-subtitle">{deals.length} عرض نشط</p>
          </div>
          <div className="admin-header-actions">
            <Link href="/admin/deals/featured-deals" className="admin-btn admin-btn-outline">
              <span>⚙️</span>
              <span className="hidden md:inline">إعدادات القسم</span>
            </Link>
            <Link href="/admin/deals/exclusive-offers" className="admin-btn admin-btn-outline">
              <span>🔥</span>
              <span className="hidden md:inline">العروض الحصرية</span>
            </Link>
            <Link href="/admin/products/add" className="admin-btn admin-btn-primary">
              <FiPlus size={18} />
              <span className="hidden md:inline">إضافة عرض</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/admin/deals/featured-deals" className="admin-card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div className="flex-1">
                <h3 className="admin-font-bold text-lg mb-1">إعدادات قسم العروض</h3>
                <p className="admin-text-sm admin-text-gray">
                  تخصيص العنوان، البنر، وعدد المنتجات المعروضة
                </p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>

          <Link href="/admin/deals/exclusive-offers" className="admin-card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div className="flex-1">
                <h3 className="admin-font-bold text-lg mb-1">العروض الحصرية</h3>
                <p className="admin-text-sm admin-text-gray">
                  إدارة قسم العروض الحصرية في الصفحة الرئيسية
                </p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي العروض</span>
            <span className="admin-stat-value">{deals.length}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">أعلى خصم</span>
            <span className="admin-stat-value danger">{maxDiscount}%</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">متوسط الخصم</span>
            <span className="admin-stat-value primary">{avgDiscount}%</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي التوفير</span>
            <span className="admin-stat-value success">
              {totalSavings.toLocaleString()} ر.س
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">جاري تحميل العروض...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && deals.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">🎁</div>
            <h3 className="admin-empty-title">لا توجد عروض حالياً</h3>
            <p className="admin-empty-text">
              ابدأ بإضافة منتجات مع أسعار مخفضة لإنشاء عروض
            </p>
            <Link href="/admin/products/add" className="admin-btn admin-btn-primary mt-4">
              <FiPlus size={18} />
              إضافة منتج جديد
            </Link>
          </div>
        )}

        {/* Deals Grid & Table */}
        {!loading && deals.length > 0 && (
          <>
            {/* Mobile Cards */}
            <div className="admin-cards-grid md:hidden">
              {deals.map((deal) => (
                <div key={deal._id} className="admin-card">
                  <div className="admin-flex admin-items-center admin-gap-3 admin-mb-4">
                    <img
                      src={deal.images[0] || '/placeholder.png'}
                      alt={deal.nameAr}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="admin-font-bold admin-truncate">{deal.nameAr}</h3>
                      <p className="admin-text-sm admin-text-gray">{deal.brand}</p>
                    </div>
                  </div>

                  <div className="admin-mb-4">
                    <span className="admin-badge admin-badge-danger">
                      {deal.discount}% خصم
                    </span>
                  </div>

                  <div className="admin-flex admin-justify-between admin-mb-4">
                    <div>
                      <p className="admin-text-sm admin-text-gray line-through">
                        {deal.originalPrice.toLocaleString()} ر.س
                      </p>
                      <p className="admin-font-bold admin-text-primary">
                        {deal.price.toLocaleString()} ر.س
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="admin-text-sm admin-text-gray">التوفير</p>
                      <p className="admin-font-bold text-green-600">
                        {(deal.originalPrice - deal.price).toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>

                  <div className="admin-mb-4">
                    <p className="admin-text-sm admin-text-gray">المخزون</p>
                    <p className={`admin-font-bold ${
                      deal.stock > 10 ? 'text-green-600' :
                      deal.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {deal.stock} قطعة
                    </p>
                  </div>

                  <div className="admin-flex admin-gap-2">
                    <Link
                      href={`/admin/products/edit/${deal._id}`}
                      className="admin-btn admin-btn-sm admin-btn-outline flex-1"
                    >
                      <FiEdit2 size={16} />
                      تعديل
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>السعر الأصلي</th>
                    <th>السعر المخفض</th>
                    <th>نسبة الخصم</th>
                    <th>التوفير</th>
                    <th>المخزون</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal._id}>
                      <td>
                        <div className="admin-flex admin-items-center admin-gap-3">
                          <img
                            src={deal.images[0] || '/placeholder.png'}
                            alt={deal.nameAr}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="admin-font-bold">{deal.nameAr}</p>
                            <p className="admin-text-sm admin-text-gray">{deal.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-text-gray line-through">
                          {deal.originalPrice.toLocaleString()} ر.س
                        </span>
                      </td>
                      <td className="admin-font-bold admin-text-primary">
                        {deal.price.toLocaleString()} ر.س
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-danger">
                          {deal.discount}% خصم
                        </span>
                      </td>
                      <td className="admin-font-bold text-green-600">
                        {(deal.originalPrice - deal.price).toLocaleString()} ر.س
                      </td>
                      <td>
                        <span className={`admin-badge ${
                          deal.stock > 10 ? 'admin-badge-success' :
                          deal.stock > 0 ? 'admin-badge-warning' : 'admin-badge-danger'
                        }`}>
                          {deal.stock} قطعة
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/products/edit/${deal._id}`}
                          className="admin-btn-icon-sm admin-btn-outline"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tips */}
        {deals.length > 0 && (
          <div className="admin-alert admin-alert-info mt-6">
            <div>
              <h3 className="admin-font-bold mb-2">💡 نصائح لإدارة العروض</h3>
              <ul className="admin-text-sm space-y-1">
                <li>• لإنشاء عرض جديد، أضف منتج مع السعر الأصلي والسعر المخفض</li>
                <li>• العروض تظهر تلقائياً عندما يكون السعر الأصلي أعلى من السعر الحالي</li>
                <li>• استخدم نسب خصم جذابة (30% أو أكثر) لجذب المزيد من العملاء</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
