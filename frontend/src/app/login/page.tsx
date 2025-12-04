'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'فشل تسجيل الدخول')
        }

        const data = await response.json()
        
        // Check if user is admin - redirect to admin login
        if (data.user.role === 'ADMIN') {
          setError('يرجى استخدام صفحة تسجيل دخول المدير')
          setLoading(false)
          setTimeout(() => {
            window.location.href = '/admin/login'
          }, 2000)
          return
        }
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('userRole', data.user.role)
        window.location.href = '/'
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'فشل إنشاء الحساب')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container-custom py-12" style={{ paddingTop: '28px' }}>
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white text-center">
              <div className="text-6xl mb-4">👋</div>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? 'مرحباً بعودتك' : 'انضم إلينا'}
              </h1>
              <p className="text-primary-100">
                {isLogin
                  ? 'سجل دخولك للمتابعة'
                  : 'أنشئ حساب جديد واستمتع بالتسوق'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 font-bold transition ${
                  isLogin
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 font-bold transition ${
                  !isLogin
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                حساب جديد
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {/* Name - Register Only */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 transition"
                      required={!isLogin}
                    />
                    <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 transition text-left"
                    required
                  />
                  <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Phone - Register Only */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold mb-2">رقم الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 transition text-left"
                      required={!isLogin}
                    />
                    <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-bold mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 pl-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 transition"
                    required
                  />
                  <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Register Only */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold mb-2">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 transition"
                      required={!isLogin}
                    />
                    <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password - Login Only */}
              {isLogin && (
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span>تذكرني</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary-600 hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              )}

              {/* Terms - Register Only */}
              {!isLogin && (
                <div className="text-sm text-gray-600">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      required
                    />
                    <span>
                      أوافق على{' '}
                      <Link href="/terms" className="text-primary-600 hover:underline">
                        الشروط والأحكام
                      </Link>{' '}
                      و{' '}
                      <Link href="/privacy" className="text-primary-600 hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التحميل...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl font-bold hover:border-gray-400 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>متابعة مع Google</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl font-bold hover:border-gray-400 transition"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>متابعة مع Facebook</span>
                </button>
              </div>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl">
              <div className="text-3xl mb-2">🚚</div>
              <p className="text-xs text-gray-600">شحن مجاني</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-xs text-gray-600">دفع آمن</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-xs text-gray-600">منتجات أصلية</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
