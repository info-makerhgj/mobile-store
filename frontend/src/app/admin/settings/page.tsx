'use client'

import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import {
  FiCreditCard,
  FiTruck,
  FiSettings,
  FiChevronLeft,
  FiLayout,
} from 'react-icons/fi'

export default function SettingsPage() {
  const router = useRouter()
  const { loading: authLoading, isAdmin } = useAdminAuth()

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">جاري التحميل...</p>
        </div>
      </AdminLayout>
    )
  }

  const settingsCategories = [
    {
      title: 'إعدادات الدفع',
      description: 'إدارة طرق الدفع والمفاتيح السرية',
      icon: FiCreditCard,
      href: '/admin/settings/payment',
      badge: 'مهم',
      badgeClass: 'admin-badge-success',
    },
    {
      title: 'إعدادات الشحن',
      description: 'إدارة شركات الشحن والأسعار',
      icon: FiTruck,
      href: '/admin/settings/shipping',
      badge: 'مهم',
      badgeClass: 'admin-badge-primary',
    },
    {
      title: 'إعدادات نهاية الصفحة',
      description: 'تحكم في محتوى وروابط الفوتر',
      icon: FiLayout,
      href: '/admin/settings/footer',
      badge: 'جديد',
      badgeClass: 'admin-badge-warning',
    },
    {
      title: 'الإعدادات العامة',
      description: 'إعدادات المتجر والضرائب',
      icon: FiSettings,
      href: '/admin/settings/general',
      badge: null,
      badgeClass: '',
    },
  ]

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">الإعدادات</h1>
            <p className="admin-header-subtitle">إدارة إعدادات المتجر</p>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="admin-cards-grid">
          {settingsCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <div className="admin-card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="admin-flex admin-items-start admin-justify-between admin-mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                    <category.icon size={24} />
                  </div>
                  {category.badge && (
                    <span className={`admin-badge ${category.badgeClass}`}>
                      {category.badge}
                    </span>
                  )}
                </div>

                <h3 className="admin-font-bold admin-text-lg admin-mb-2">
                  {category.title}
                </h3>
                <p className="admin-text-sm admin-text-gray admin-mb-4">
                  {category.description}
                </p>

                <div className="admin-flex admin-items-center admin-gap-2 admin-text-primary">
                  <span className="admin-text-sm admin-font-bold">إدارة الإعدادات</span>
                  <FiChevronLeft size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Info */}
        <div className="admin-alert admin-alert-info mt-6">
          <div>
            <h3 className="admin-font-bold mb-2">💡 معلومات مهمة</h3>
            <ul className="admin-text-sm space-y-1">
              <li>• تأكد من تفعيل طريقة دفع واحدة على الأقل</li>
              <li>• قم بإعداد شركة شحن واحدة على الأقل لتفعيل الطلبات</li>
              <li>• راجع الإعدادات بشكل دوري للتأكد من صحتها</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
