'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  FiSearch,
  FiMail,
  FiPhone,
  FiRefreshCw,
} from 'react-icons/fi'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  completedOrders: number
  totalSpent: number
  joinDate: string
  lastOrderDate: string | null
  status: 'active' | 'inactive'
}

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const token = localStorage.getItem('token')
      if (!token) {
        setError('يجب تسجيل الدخول أولاً')
        return
      }

      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(
        `${API_URL}/customers?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات العملاء')
      }

      const data = await response.json()
      setCustomers(data.customers)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(
        `${API_URL}/customers/stats/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = customers.slice(startIndex, endIndex)

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">إدارة العملاء</h1>
            <p className="admin-header-subtitle">
              {loading ? 'جاري التحميل...' : `${customers.length} عميل`}
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              onClick={() => {
                fetchCustomers()
                fetchStats()
              }}
              className="admin-btn admin-btn-primary"
            >
              <FiRefreshCw size={18} />
              <span className="hidden md:inline">تحديث</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="admin-alert admin-alert-danger">
            <p>{error}</p>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">إجمالي العملاء</span>
              <span className="admin-stat-value">{stats.totalCustomers}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">نشطين</span>
              <span className="admin-stat-value success">{stats.activeCustomers}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">إجمالي الطلبات</span>
              <span className="admin-stat-value">{stats.totalOrders}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">إجمالي الإيرادات</span>
              <span className="admin-stat-value primary">
                {stats.totalRevenue.toLocaleString()} ر.س
              </span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="admin-search-section">
          <div className="admin-search-row">
            <div className="admin-search-input-wrapper">
              <input
                type="text"
                placeholder="ابحث عن عميل (الاسم، البريد، الجوال)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <FiSearch className="admin-search-icon" size={20} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">جميع العملاء</option>
              <option value="active">نشطين</option>
              <option value="inactive">غير نشطين</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">جاري تحميل العملاء...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && customers.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">👥</div>
            <h3 className="admin-empty-title">لا يوجد عملاء</h3>
            <p className="admin-empty-text">
              {searchQuery ? 'جرب البحث بكلمات مختلفة' : 'لم يتم تسجيل أي عملاء بعد'}
            </p>
          </div>
        )}

        {/* Customers Grid */}
        {!loading && customers.length > 0 && (
          <>
            <div className="admin-cards-grid">
              {currentCustomers.map((customer) => (
              <div key={customer.id} className="admin-card">
                <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                  <div className="admin-flex admin-items-center admin-gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div>
                      <h3 className="admin-font-bold">{customer.name}</h3>
                      <p className="admin-text-sm admin-text-gray">
                        انضم {formatDate(customer.joinDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`admin-badge ${
                      customer.status === 'active'
                        ? 'admin-badge-success'
                        : 'admin-badge-gray'
                    }`}
                  >
                    {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="space-y-3 admin-mb-4">
                  <div className="admin-flex admin-items-center admin-gap-2 admin-text-sm admin-text-gray">
                    <FiMail size={16} />
                    <span className="admin-truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="admin-flex admin-items-center admin-gap-2 admin-text-sm admin-text-gray" dir="ltr">
                      <FiPhone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 admin-mb-4 pt-4 border-t">
                  <div>
                    <p className="admin-text-sm admin-text-gray mb-1">الطلبات</p>
                    <p className="admin-text-lg admin-font-bold">{customer.orders}</p>
                    <p className="admin-text-sm admin-text-gray">
                      {customer.completedOrders} مكتمل
                    </p>
                  </div>
                  <div>
                    <p className="admin-text-sm admin-text-gray mb-1">إجمالي الإنفاق</p>
                    <p className="admin-text-lg admin-font-bold admin-text-primary">
                      {customer.totalSpent.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>

                {customer.lastOrderDate && (
                  <p className="admin-text-sm admin-text-gray admin-mb-4">
                    آخر طلب: {formatDate(customer.lastOrderDate)}
                  </p>
                )}

                <div className="admin-flex admin-gap-2">
                  <a
                    href={`mailto:${customer.email}`}
                    className="admin-btn admin-btn-sm admin-btn-outline flex-1"
                  >
                    إرسال بريد
                  </a>
                  {customer.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="admin-btn-icon-sm admin-btn-outline"
                    >
                      <FiPhone size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-flex admin-items-center admin-justify-between admin-mt-6 admin-p-4 bg-white rounded-lg">
                <div className="admin-text-sm admin-text-gray">
                  عرض {startIndex + 1} - {Math.min(endIndex, customers.length)} من {customers.length}
                </div>
                <div className="admin-flex admin-gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="admin-btn admin-btn-sm admin-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  
                  <div className="admin-flex admin-gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg admin-font-bold transition ${
                              currentPage === page
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="admin-flex admin-items-center admin-px-2">...</span>
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="admin-btn admin-btn-sm admin-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
