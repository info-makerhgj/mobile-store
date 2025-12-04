'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiMail, FiPhone, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

interface FooterSettings {
  brandName: string
  brandTagline: string
  brandDescription: string
  phone: string
  email: string
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
  }
  quickLinks: Array<{ title: string; url: string }>
  supportLinks: Array<{ title: string; url: string }>
  copyright: string
  features: Array<{ icon: string; text: string }>
}

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/settings/footer')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.footer)
        }
      })
      .catch(err => console.error('Error loading footer settings:', err))
  }, [])

  if (!settings) {
    return null
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white mt-16">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-10">
        <div className="container-custom max-w-lg mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">اشترك معنا</h3>
          <p className="text-sm text-primary-100 mb-5">احصل على أحدث العروض والمنتجات</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:border-white text-white placeholder:text-white/60 text-sm"
            />
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition whitespace-nowrap">
              اشترك
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom" style={{ paddingTop: '18px', paddingBottom: '22px' }}>
        {/* Brand - Mobile Only */}
        <div className="md:hidden text-right mb-10">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt={settings.brandName} width={45} height={45} className="object-contain" />
            <div>
              <div className="text-lg font-bold">{settings.brandName}</div>
              <div className="text-xs text-gray-400">{settings.brandTagline}</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {settings.brandDescription}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 text-right">
          {/* Brand - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt={settings.brandName} width={45} height={45} className="object-contain" />
              <div>
                <div className="text-lg font-bold">{settings.brandName}</div>
                <div className="text-xs text-gray-400">{settings.brandTagline}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings.brandDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-primary-400">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {settings.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.url} className="hover:text-primary-400 transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-primary-400">الدعم</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {settings.supportLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.url} className="hover:text-primary-400 transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-primary-400">تواصل معنا</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FiPhone size={16} className="text-primary-400" />
                <span dir="ltr" className="text-right">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail size={16} className="text-primary-400" />
                <span dir="ltr" className="text-right">{settings.email}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {settings.socialMedia.instagram && (
                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                  <FiInstagram size={18} />
                </a>
              )}
              {settings.socialMedia.twitter && (
                <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                  <FiTwitter size={18} />
                </a>
              )}
              {settings.socialMedia.facebook && (
                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                  <FiFacebook size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-3">{settings.copyright}</p>
          {settings.features && settings.features.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
              {settings.features.map((feature, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">•</span>}
                  <span className="flex items-center gap-1">
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </span>
                </span>
              ))}
            </div>
          )}
          <Link href="/admin/login" className="text-xs text-gray-600 hover:text-primary-400 transition">
            تسجيل دخول المدير
          </Link>
        </div>
      </div>
    </footer>
  )
}
