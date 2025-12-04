'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiX,
  FiLayout,
} from 'react-icons/fi'

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activePage: string
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, activePage }: AdminSidebarProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/admin/login')
  }

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">أبعاد التواصل</h2>
            <p className="text-xs text-gray-400">لوحة الإدارة</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-slate-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role === 'ADMIN' ? 'مدير' : 'مستخدم'}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'dashboard'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiHome size={20} />
            <span>الرئيسية</span>
          </Link>
          <Link
            href="/admin/homepage"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'homepage'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiLayout size={20} />
            <span>الصفحة الرئيسية</span>
          </Link>
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'products'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiPackage size={20} />
            <span>المنتجات</span>
          </Link>
          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'orders'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiShoppingBag size={20} />
            <span>الطلبات</span>
          </Link>
          <Link
            href="/admin/customers"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'customers'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiUsers size={20} />
            <span>العملاء</span>
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activePage === 'settings'
                ? 'bg-primary-600 font-bold'
                : 'hover:bg-slate-700'
            }`}
          >
            <FiSettings size={20} />
            <span>الإعدادات</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600 rounded-xl transition"
          >
            <FiLogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
