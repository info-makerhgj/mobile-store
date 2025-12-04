'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
} from 'react-icons/fi'

export default function AdminDashboard() {
  const router = useRouter()
  const { loading: authLoading, isAdmin } = useAdminAuth()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin || authLoading) return

    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        // Fetch user profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUser(profileData.user)
        } else {
          router.push('/admin/login')
          return
        }

        // Fetch orders
        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          // Handle both array and object with orders property
          const ordersArray = Array.isArray(ordersData) ? ordersData : (ordersData.orders || [])
          setOrders(ordersArray.slice(0, 4))
        }

        // Fetch products
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          // Handle both array and object with products property
          const productsArray = Array.isArray(productsData) ? productsData : (productsData.products || [])
          setProducts(productsArray.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, isAdmin, authLoading])

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">جاري تحميل البيانات...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return null
  }

  // Calculate dynamic stats
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

  const recentOrders = [
    {
      id: '#12345',
      customer: 'أحمد محمد',
      product: 'أبعاد X برو',
      amount: 2999,
      status: 'completed',
      date: '2025-01-20',
    },
    {
      id: '#12344',
      customer: 'فاطمة علي',
      product: 'أبعاد Watch',
      amount: 1299,
      status: 'processing',
      date: '2025-01-20',
    },
    {
      id: '#12343',
      customer: 'محمد سعيد',
      product: 'أبعاد Buds Pro',
      amount: 899,
      status: 'shipping',
      date: '2025-01-19',
    },
    {
      id: '#12342',
      customer: 'نورة خالد',
      product: 'حافظة جلدية',
      amount: 199,
      status: 'completed',
      date: '2025-01-19',
    },
  ]

  const topProducts = [
    { name: 'أبعاد X برو', sales: 145, revenue: 434550 },
    { name: 'أبعاد Watch', sales: 98, revenue: 127302 },
    { name: 'أبعاد Buds Pro', sales: 76, revenue: 68324 },
    { name: 'حافظة جلدية فاخرة', sales: 234, revenue: 46566 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600'
      case 'processing':
        return 'bg-orange-100 text-orange-600'
      case 'shipping':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'processing':
        return 'قيد المعالجة'
      case 'shipping':
        return 'قيد الشحن'
      default:
        return status
    }
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">📊 لوحة التحكم</h1>
            <p className="admin-header-subtitle">مرحباً بك، {user?.name || 'المدير'}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-flex admin-items-center admin-justify-between admin-mb-2">
              <span className="admin-stat-label">إجمالي المبيعات</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <FiDollarSign size={20} />
              </div>
            </div>
            <span className="admin-stat-value success">{totalRevenue.toLocaleString()} ر.س</span>
            <div className="admin-flex admin-items-center admin-gap-2 admin-mt-2">
              <FiTrendingUp className="text-green-600" size={14} />
              <span className="admin-text-xs text-green-600 font-bold">+12.5%</span>
              <span className="admin-text-xs admin-text-gray">من الشهر الماضي</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-flex admin-items-center admin-justify-between admin-mb-2">
              <span className="admin-stat-label">الطلبات</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                <FiShoppingCart size={20} />
              </div>
            </div>
            <span className="admin-stat-value primary">{totalOrders}</span>
            <div className="admin-flex admin-items-center admin-gap-2 admin-mt-2">
              <FiTrendingUp className="text-green-600" size={14} />
              <span className="admin-text-xs text-green-600 font-bold">+8.2%</span>
              <span className="admin-text-xs admin-text-gray">من الشهر الماضي</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-flex admin-items-center admin-justify-between admin-mb-2">
              <span className="admin-stat-label">المنتجات</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <FiPackage size={20} />
              </div>
            </div>
            <span className="admin-stat-value">{totalProducts}</span>
            <div className="admin-flex admin-items-center admin-gap-2 admin-mt-2">
              <FiTrendingUp className="text-green-600" size={14} />
              <span className="admin-text-xs text-green-600 font-bold">+3</span>
              <span className="admin-text-xs admin-text-gray">منتجات جديدة</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-flex admin-items-center admin-justify-between admin-mb-2">
              <span className="admin-stat-label">العملاء</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                <FiUsers size={20} />
              </div>
            </div>
            <span className="admin-stat-value">1,234</span>
            <div className="admin-flex admin-items-center admin-gap-2 admin-mt-2">
              <FiTrendingUp className="text-green-600" size={14} />
              <span className="admin-text-xs text-green-600 font-bold">+15.3%</span>
              <span className="admin-text-xs admin-text-gray">من الشهر الماضي</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="admin-card">
              <div className="admin-flex admin-items-center admin-justify-between admin-mb-6">
                <h2 className="admin-text-xl admin-font-bold">أحدث الطلبات</h2>
                <Link href="/admin/orders" className="admin-btn admin-btn-sm admin-btn-outline">
                  عرض الكل
                </Link>
              </div>

              {/* Mobile Cards */}
              <div className="admin-cards-grid md:hidden">
                {recentOrders.map((order) => (
                  <div key={order.id} className="admin-card">
                    <div className="admin-flex admin-justify-between admin-mb-3">
                      <span className="admin-font-bold admin-text-primary">{order.id}</span>
                      <span className={`admin-badge ${
                        order.status === 'completed' ? 'admin-badge-success' :
                        order.status === 'processing' ? 'admin-badge-warning' :
                        'admin-badge-info'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <h3 className="admin-font-bold admin-mb-2">{order.customer}</h3>
                    <p className="admin-text-sm admin-text-gray admin-mb-3">{order.product}</p>
                    <div className="admin-flex admin-justify-between admin-items-center">
                      <span className="admin-font-bold admin-text-lg">{order.amount.toLocaleString()} ر.س</span>
                      <span className="admin-text-xs admin-text-gray">{order.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>العميل</th>
                      <th>المنتج</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="admin-font-bold admin-text-primary">{order.id}</span>
                        </td>
                        <td>{order.customer}</td>
                        <td className="admin-text-gray">{order.product}</td>
                        <td className="admin-font-bold">{order.amount.toLocaleString()} ر.س</td>
                        <td>
                          <span className={`admin-badge ${
                            order.status === 'completed' ? 'admin-badge-success' :
                            order.status === 'processing' ? 'admin-badge-warning' :
                            'admin-badge-info'
                          }`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="admin-card">
            <h2 className="admin-text-xl admin-font-bold admin-mb-6">المنتجات الأكثر مبيعاً</h2>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="admin-flex admin-items-center admin-justify-between admin-pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <h3 className="admin-font-bold admin-mb-1">{product.name}</h3>
                    <p className="admin-text-sm admin-text-gray">{product.sales} مبيعة</p>
                  </div>
                  <div className="text-left">
                    <p className="admin-font-bold admin-text-primary">
                      {product.revenue.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
