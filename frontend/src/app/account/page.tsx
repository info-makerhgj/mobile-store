'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiEdit2,
  FiSave,
  FiX,
} from 'react-icons/fi'

const AddressManager = dynamic(() => import('../../components/AddressManager'), { ssr: false })

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUser(profileData.user)
          setFormData({
            name: profileData.user.name || '',
            email: profileData.user.email || '',
            phone: profileData.user.phone || '',
          })
        }

        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          // إخفاء الطلبات DRAFT (غير المكتملة)
          const allOrders = ordersData.orders || ordersData || []
          const confirmedOrders = allOrders.filter((order: any) => 
            order.status !== 'draft' && order.status !== 'DRAFT'
          )
          setOrders(confirmedOrders)
        }

        const addressesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (addressesRes.ok) {
          const addressesData = await addressesRes.json()
          setAddresses(addressesData.addresses || [])
        }

        // جلب المفضلة من localStorage
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
        if (favoriteIds.length > 0) {
          const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
          if (productsRes.ok) {
            const productsData = await productsRes.json()
            const allProducts = productsData.data || productsData || []
            const favoriteProducts = allProducts.filter((p: any) => favoriteIds.includes(p.id || p._id))
            setFavorites(favoriteProducts)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const removeFavorite = (productId: string) => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
    const newFavorites = favoriteIds.filter((id: string) => id !== productId)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setFavorites(favorites.filter(p => (p.id || p._id) !== productId))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/')
  }

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setEditMode(false)
        alert('تم تحديث الملف الشخصي بنجاح')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('حدث خطأ أثناء التحديث')
    }
  }

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container-custom py-16 text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'confirmed':
        return 'text-green-600 bg-green-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'shipped':
      case 'shipping':
        return 'text-purple-600 bg-purple-50'
      case 'delivered':
        return 'text-green-700 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار التأكيد'
      case 'confirmed':
        return 'مؤكد'
      case 'processing':
        return 'قيد المعالجة'
      case 'shipped':
      case 'shipping':
        return 'قيد الشحن'
      case 'delivered':
        return 'تم التوصيل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock size={16} />
      case 'confirmed':
        return <FiCheckCircle size={16} />
      case 'processing':
        return <FiClock size={16} />
      case 'shipped':
      case 'shipping':
        return <FiPackage size={16} />
      case 'delivered':
        return <FiCheckCircle size={16} />
      case 'cancelled':
        return <FiX size={16} />
      default:
        return null
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">حسابي</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
                  {user.avatar || '👤'}
                </div>
                <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FiShoppingBag size={20} />
                  <span>طلباتي</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'wishlist'
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FiHeart size={20} />
                  <span>المفضلة</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'addresses'
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FiMapPin size={20} />
                  <span>العناوين</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FiUser size={20} />
                  <span>الملف الشخصي</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FiSettings size={20} />
                  <span>الإعدادات</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                >
                  <FiLogOut size={20} />
                  <span>تسجيل الخروج</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">طلباتي</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShoppingBag size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
                    <p className="text-gray-600 mb-6">لم تقم بأي طلبات بعد</p>
                    <Link
                      href="/products"
                      className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition"
                    >
                      تصفح المنتجات
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{order.orderNumber || `طلب #${order._id?.slice(-6)}`}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <span
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="border-t border-b py-3 my-3 space-y-2">
                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <span className="text-gray-600 font-bold">{item.quantity}×</span>
                                <span className="font-medium text-gray-800">
                                  {item.productName || item.name || 'منتج'}
                                </span>
                                <span className="text-gray-500 mr-auto">
                                  {(item.price * item.quantity).toLocaleString('en-US')} ر.س
                                </span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-xs text-gray-500">و {order.items.length - 3} منتج آخر...</p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">طريقة الدفع</p>
                            <p className="font-medium">{order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'مدفوع'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">الإجمالي</p>
                            <p className="text-xl font-bold text-primary-600">
                              {order.total?.toLocaleString('en-US')} ر.س
                            </p>
                          </div>
                          <Link
                            href={`/orders/${encodeURIComponent(order.orderNumber || order._id)}`}
                            className="btn btn-outline btn-sm whitespace-nowrap"
                          >
                            عرض التفاصيل
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">المفضلة</h2>
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiHeart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">لا توجد منتجات مفضلة</h3>
                    <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات للمفضلة</p>
                    <Link
                      href="/products"
                      className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition"
                    >
                      تصفح المنتجات
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <div key={product.id || product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                        <Link href={`/products/${product.id || product._id}`}>
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img src={product.images[0]} alt={product.nameAr} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-6xl">📱</span>
                            )}
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${product.id || product._id}`}>
                            <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                            <h3 className="font-bold mb-2 line-clamp-2">{product.nameAr}</h3>
                            <p className="text-primary-600 font-bold text-lg mb-3">
                              {product.price.toLocaleString()} ر.س
                            </p>
                          </Link>
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id || product._id}`}
                              className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-center font-bold hover:bg-primary-700 transition text-sm"
                            >
                              عرض المنتج
                            </Link>
                            <button
                              onClick={() => removeFavorite(product.id || product._id)}
                              className="w-10 h-10 border-2 border-red-500 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-50 transition"
                              aria-label="إزالة من المفضلة"
                            >
                              <FiX size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">العناوين</h2>
                <AddressManager />
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">الملف الشخصي</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 transition"
                    >
                      <FiEdit2 size={18} />
                      تعديل
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                      >
                        <FiSave size={18} />
                        حفظ
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                          })
                        }}
                        className="flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-lg font-bold hover:border-red-500 hover:text-red-600 transition"
                      >
                        <FiX size={18} />
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">الاسم</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">رقم الجوال</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 disabled:bg-gray-50"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>
                <div className="bg-white rounded-2xl p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-4">الإشعارات</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span>إشعارات البريد الإلكتروني</span>
                          <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>إشعارات الطلبات</span>
                          <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>العروض والخصومات</span>
                          <input type="checkbox" className="w-5 h-5" />
                        </label>
                      </div>
                    </div>
                    <div className="border-t pt-6">
                      <h3 className="font-bold mb-4 text-red-600">منطقة الخطر</h3>
                      <button className="w-full border-2 border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-bold">
                        حذف الحساب
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
