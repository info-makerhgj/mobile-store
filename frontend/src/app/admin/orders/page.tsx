'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  FiSearch,
  FiEye,
  FiDownload,
  FiShoppingBag,
} from 'react-icons/fi'

export default function AdminOrders() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (response.ok) {
          const data = await response.json()
          const ordersArray = Array.isArray(data) ? data : (data.orders || [])
          
          // طباعة أول طلب للتشخيص
          if (ordersArray.length > 0) {
            console.log('🔍 Sample Order Data:', ordersArray[0])
            console.log('📦 Shipping Address:', ordersArray[0].shippingAddress)
            console.log('👤 User:', ordersArray[0].user)
          }
          
          setOrders(ordersArray)
        } else if (response.status === 401) {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'PENDING': 'admin-badge-warning',
      'PROCESSING': 'admin-badge-info',
      'SHIPPED': 'admin-badge-primary',
      'DELIVERED': 'admin-badge-success',
      'CANCELLED': 'admin-badge-danger',
    }
    return badges[status] || 'admin-badge-gray'
  }

  const getStatusText = (status: string) => {
    const texts: any = {
      'PENDING': 'قيد الانتظار',
      'PROCESSING': 'قيد المعالجة',
      'SHIPPED': 'قيد الشحن',
      'DELIVERED': 'مكتمل',
      'CANCELLED': 'ملغي',
      'pending': 'قيد الانتظار',
      'processing': 'قيد المعالجة',
      'shipped': 'قيد الشحن',
      'delivered': 'مكتمل',
      'cancelled': 'ملغي',
      'confirmed': 'مؤكد',
    }
    return texts[status] || texts[status?.toUpperCase()] || status
  }

  const filteredOrders = orders.filter(o =>
    o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingAddress?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">إدارة الطلبات</h1>
            <p className="admin-header-subtitle">{orders.length} طلب</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn admin-btn-primary">
              <FiDownload size={18} />
              <span className="hidden md:inline">تصدير</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي الطلبات</span>
            <span className="admin-stat-value">{orders.length}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">قيد المعالجة</span>
            <span className="admin-stat-value primary">
              {orders.filter(o => o.status === 'PROCESSING').length}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">مكتملة</span>
            <span className="admin-stat-value success">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">ملغية</span>
            <span className="admin-stat-value danger">
              {orders.filter(o => o.status === 'CANCELLED').length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="admin-search-section">
          <div className="admin-search-row">
            <div className="admin-search-input-wrapper">
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم العميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <FiSearch className="admin-search-icon" size={20} />
            </div>
            <select className="admin-select">
              <option>جميع الحالات</option>
              <option>قيد الانتظار</option>
              <option>قيد المعالجة</option>
              <option>مكتمل</option>
              <option>ملغي</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">جاري تحميل الطلبات...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">🛒</div>
            <h3 className="admin-empty-title">لا توجد طلبات</h3>
            <p className="admin-empty-text">
              {searchQuery ? 'جرب البحث بكلمات مختلفة' : 'لم يتم إنشاء أي طلبات بعد'}
            </p>
          </div>
        )}

        {/* Orders Grid & Table */}
        {!loading && filteredOrders.length > 0 && (
          <>
            {/* Mobile Cards */}
            <div className="admin-cards-grid md:hidden">
              {currentOrders.map((order) => {
                const orderId = order._id || order.id
                const orderNumber = order.orderNumber || `#${orderId?.slice(-6)}` || '#000000'
                
                // جلب اسم العميل من جميع المصادر الممكنة
                let customerName = 'عميل'
                
                // جرب من user
                if (order.user?.name) {
                  customerName = order.user.name
                }
                // جرب من shippingAddress
                else if (order.shippingAddress) {
                  const addr = order.shippingAddress
                  if (typeof addr === 'object') {
                    customerName = addr.fullName || addr.name || addr.firstName || addr.customerName || addr.recipientName || 'عميل'
                  } else if (typeof addr === 'string') {
                    try {
                      const parsed = JSON.parse(addr)
                      customerName = parsed.fullName || parsed.name || parsed.firstName || parsed.customerName || parsed.recipientName || 'عميل'
                    } catch {
                      // إذا فشل الـ parse، جرب استخراج الاسم من النص
                      const nameMatch = addr.match(/"(?:fullName|name|firstName)"\s*:\s*"([^"]+)"/)
                      customerName = nameMatch ? nameMatch[1] : 'عميل'
                    }
                  }
                }
                // جرب من customerName مباشرة
                else if (order.customerName) {
                  customerName = order.customerName
                }
                // جرب من customer object
                else if (order.customer?.name) {
                  customerName = order.customer.name
                }
                
                return (
                <div key={orderId} className="admin-card">
                  <div className="admin-flex admin-justify-between admin-mb-4">
                    <div>
                      <p className="admin-text-sm admin-text-gray">رقم الطلب</p>
                      <p className="admin-font-bold admin-text-primary">
                        {orderNumber}
                      </p>
                    </div>
                    <span className={`admin-badge ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="admin-mb-4">
                    <p className="admin-text-sm admin-text-gray">العميل</p>
                    <p className="admin-font-bold">
                      {customerName}
                    </p>
                  </div>

                  <div className="admin-flex admin-justify-between admin-mb-4">
                    <div>
                      <p className="admin-text-sm admin-text-gray">المنتجات</p>
                      <p className="admin-font-bold">{order.items?.length || 0}</p>
                    </div>
                    <div className="text-left">
                      <p className="admin-text-sm admin-text-gray">المبلغ</p>
                      <p className="admin-font-bold admin-text-primary">
                        {order.total?.toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>

                  <div className="admin-mb-4">
                    <p className="admin-text-sm admin-text-gray">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/admin/orders/${orderId}`)}
                    className="admin-btn admin-btn-sm admin-btn-outline admin-btn-full"
                  >
                    <FiEye size={16} />
                    عرض التفاصيل
                  </button>
                </div>
              )})}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>المنتجات</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => {
                    const orderId = order._id || order.id
                    const orderNumber = order.orderNumber || `#${orderId?.slice(-6)}` || '#000000'
                    
                    // جلب اسم العميل من جميع المصادر الممكنة
                    let customerName = 'عميل'
                    let customerPhone = '-'
                    
                    // جرب من user
                    if (order.user?.name) {
                      customerName = order.user.name
                      customerPhone = order.user.phone || '-'
                    }
                    // جرب من shippingAddress
                    else if (order.shippingAddress) {
                      const addr = order.shippingAddress
                      if (typeof addr === 'object') {
                        customerName = addr.fullName || addr.name || addr.firstName || addr.customerName || addr.recipientName || 'عميل'
                        customerPhone = addr.phone || addr.mobile || addr.phoneNumber || '-'
                      } else if (typeof addr === 'string') {
                        try {
                          const parsed = JSON.parse(addr)
                          customerName = parsed.fullName || parsed.name || parsed.firstName || parsed.customerName || parsed.recipientName || 'عميل'
                          customerPhone = parsed.phone || parsed.mobile || parsed.phoneNumber || '-'
                        } catch {
                          // إذا فشل الـ parse، جرب استخراج الاسم من النص
                          const nameMatch = addr.match(/"(?:fullName|name|firstName)"\s*:\s*"([^"]+)"/)
                          const phoneMatch = addr.match(/"(?:phone|mobile|phoneNumber)"\s*:\s*"([^"]+)"/)
                          customerName = nameMatch ? nameMatch[1] : 'عميل'
                          customerPhone = phoneMatch ? phoneMatch[1] : '-'
                        }
                      }
                    }
                    // جرب من customerName مباشرة
                    else if (order.customerName) {
                      customerName = order.customerName
                      customerPhone = order.customerPhone || order.phone || '-'
                    }
                    // جرب من customer object
                    else if (order.customer?.name) {
                      customerName = order.customer.name
                      customerPhone = order.customer.phone || '-'
                    }
                    
                    return (
                    <tr key={orderId}>
                      <td>
                        <span className="admin-font-bold admin-text-primary">
                          {orderNumber}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="admin-font-bold">
                            {customerName}
                          </p>
                          <p className="admin-text-sm admin-text-gray">
                            {customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="admin-text-gray">{order.items?.length || 0} منتج</td>
                      <td className="admin-font-bold">
                        {order.total?.toLocaleString()} ر.س
                      </td>
                      <td>
                        <span className={`admin-badge ${getStatusBadge(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="admin-text-sm admin-text-gray">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/admin/orders/${orderId}`)}
                          className="admin-btn-icon-sm admin-btn-outline"
                        >
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-flex admin-items-center admin-justify-between admin-mt-6 admin-p-4 bg-white rounded-lg">
                <div className="admin-text-sm admin-text-gray">
                  عرض {startIndex + 1} - {Math.min(endIndex, filteredOrders.length)} من {filteredOrders.length}
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
