'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiGrid,
  FiPercent,
  FiTruck,
} from 'react-icons/fi'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/admin/login')
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/admin/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'الرئيسية', color: 'from-blue-500 to-blue-600' },
    { path: '/admin/homepage-builder', icon: FiGrid, label: 'الصفحة الرئيسية', color: 'from-purple-500 to-purple-600' },
    { path: '/admin/products', icon: FiPackage, label: 'المنتجات', color: 'from-green-500 to-green-600' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'الطلبات', color: 'from-orange-500 to-orange-600' },
    { path: '/admin/distribution', icon: FiTruck, label: 'التوزيع', color: 'from-indigo-500 to-indigo-600' },
    { path: '/admin/deals', icon: FiPercent, label: 'العروض', color: 'from-red-500 to-red-600' },
    { path: '/admin/customers', icon: FiUsers, label: 'العملاء', color: 'from-cyan-500 to-cyan-600' },
    { path: '/admin/settings', icon: FiSettings, label: 'الإعدادات', color: 'from-gray-500 to-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Close Button */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  أ
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">أبعاد التواصل</h2>
                  <p className="text-xs text-gray-500">لوحة الإدارة</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600">
                    {user.role === 'ADMIN' ? '👑 مدير النظام' : 'مستخدم'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                    active 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <item.icon size={18} className={active ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all">
                <FiLogOut size={18} />
              </div>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu & Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <FiMenu size={22} className="text-gray-700" />
                </button>
                
                {/* Page Title - Dynamic */}
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    {menuItems.find(item => isActive(item.path))?.label || 'لوحة التحكم'}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    إدارة ومتابعة جميع العمليات
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <FiEye size={18} />
                  <span className="hidden sm:inline">عرض الموقع</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <p>© 2024 أبعاد التواصل. جميع الحقوق محفوظة.</p>
            <p className="text-xs">النسخة 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
