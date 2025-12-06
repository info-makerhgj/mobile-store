'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'
import DealsBanner from '@/components/home/DealsBanner'

function CartButton() {
  const { itemCount } = useCart()
  
  return (
    <Link href="/cart" className="btn btn-icon btn-ghost relative">
      <FiShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // Fetch categories
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error loading categories:', err))
  }, [])

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Deals Banner */}
      <DealsBanner />

      {/* Main Header */}
      <div className="container-mobile">
        <div className="flex items-center justify-between" style={{ height: '56px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <img src="/logo.png" alt="أبعاد التواصل" width={40} height={40} className="object-contain" />
            <div className="hidden md:block">
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }} className="text-primary-600">أبعاد التواصل</div>
              <div style={{ fontSize: 'var(--text-xs)' }} className="text-gray-500">أبعاد جديدة للتواصل التقني</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center" style={{ gap: 'var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
            <Link href="/" className="hover:text-primary-600 transition-base">الرئيسية</Link>
            <Link href="/products" className="hover:text-primary-600 transition-base">جميع المنتجات</Link>
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/products?category=${cat.slug}`} 
                className="hover:text-primary-600 transition-base"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/deals" className="text-red-600 hover:text-red-700 transition-base flex items-center gap-1">
              <span>🔥</span>
              <span>العروض</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="btn btn-icon btn-ghost"
            >
              <FiSearch size={20} />
            </button>
            <Link href="/account" className="btn btn-icon btn-ghost">
              <FiUser size={20} />
            </Link>
            <CartButton />
            <button 
              className="lg:hidden btn btn-icon btn-ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div style={{ paddingBottom: 'var(--space-4)' }} className="animate-fadeIn">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="ابحث عن جوال، إكسسوار..."
                className="input"
                style={{ paddingLeft: 'var(--space-12)', borderRadius: 'var(--radius-full)' }}
                autoFocus
              />
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container-mobile flex flex-col" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-4)', gap: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
            <Link href="/" className="hover:text-primary-600 transition-base" style={{ padding: 'var(--space-2) 0' }}>الرئيسية</Link>
            <Link href="/products" className="hover:text-primary-600 transition-base" style={{ padding: 'var(--space-2) 0' }}>جميع المنتجات</Link>
            {categories.map((cat) => (
              <Link 
                key={cat.slug}
                href={`/products?category=${cat.slug}`} 
                className="hover:text-primary-600 transition-base" 
                style={{ padding: 'var(--space-2) 0' }}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/deals" className="text-red-600 transition-base flex items-center gap-2" style={{ padding: 'var(--space-2) 0' }}>
              <span>🔥</span>
              <span>العروض الحصرية</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
