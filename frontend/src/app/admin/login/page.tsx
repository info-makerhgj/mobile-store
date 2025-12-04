'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول')
      }

      // Check if user is admin
      if (data.user.role !== 'ADMIN') {
        setError('هذا الحساب ليس حساب مدير')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10 relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-5xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">لوحة تحكم المدير</h1>
          <p className="text-gray-600 text-lg">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 animate-shake">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={22} />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">البريد الإلكتروني</label>
            <div className="relative group">
              <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={22} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-gray-50 focus:bg-white"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">كلمة المرور</label>
            <div className="relative group">
              <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={22} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
            <span>←</span>
            العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </div>
  )
}
