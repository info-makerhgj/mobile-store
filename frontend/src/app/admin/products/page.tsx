'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminProducts() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filteredProducts = products.filter(p =>
    p.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

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
            <h1 className="admin-header-title">إدارة المنتجات</h1>
            <p className="admin-header-subtitle">{products.length} منتج</p>
          </div>
          <div className="admin-header-actions">
            <Link href="/admin/products/add" className="admin-btn admin-btn-primary">
              <FiPlus size={18} />
              <span className="hidden md:inline">إضافة منتج</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي المنتجات</span>
            <span className="admin-stat-value">{products.length}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">متوفر</span>
            <span className="admin-stat-value success">
              {products.filter(p => p.stock > 0).length}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">نفذت الكمية</span>
            <span className="admin-stat-value danger">
              {products.filter(p => p.stock === 0).length}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي القيمة</span>
            <span className="admin-stat-value primary">
              {products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()} ر.س
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="admin-search-section">
          <div className="admin-search-row">
            <div className="admin-search-input-wrapper">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <FiSearch className="admin-search-icon" size={20} />
            </div>
            <select className="admin-select">
              <option>جميع الفئات</option>
              <option>جوالات</option>
              <option>ساعات ذكية</option>
              <option>سماعات</option>
            </select>
            <select className="admin-select">
              <option>جميع الحالات</option>
              <option>متوفر</option>
              <option>نفذت الكمية</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">جاري تحميل المنتجات...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <h3 className="admin-empty-title">لا توجد منتجات</h3>
            <p className="admin-empty-text">
              {searchQuery ? 'جرب البحث بكلمات مختلفة' : 'ابدأ بإضافة منتج جديد'}
            </p>
          </div>
        )}

        {/* Products Grid (Mobile) & Table (Desktop) */}
        {!loading && filteredProducts.length > 0 && (
          <>
            {/* Mobile Cards */}
            <div className="admin-cards-grid md:hidden">
              {currentProducts.map((product) => (
                <div key={product.id} className="admin-card">
                  <div className="admin-flex admin-items-center admin-gap-3 admin-mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        product.images[0].startsWith('data:image') || product.images[0].startsWith('http') ? (
                          <img src={product.images[0]} alt={product.nameAr} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{product.images[0]}</span>
                        )
                      ) : (
                        <span className="text-2xl">📱</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="admin-font-bold admin-truncate">{product.nameAr}</h3>
                      <p className="admin-text-sm admin-text-gray">{product.category}</p>
                    </div>
                  </div>

                  <div className="admin-flex admin-justify-between admin-mb-4">
                    <div>
                      <p className="admin-text-sm admin-text-gray">السعر</p>
                      <p className="admin-font-bold admin-text-primary">
                        {product.price.toLocaleString()} ر.س
                      </p>
                    </div>
                    <div>
                      <p className="admin-text-sm admin-text-gray">المخزون</p>
                      <p className={`admin-font-bold ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 20 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="admin-mb-4">
                    <span className={`admin-badge ${
                      product.stock > 0 ? 'admin-badge-success' : 'admin-badge-danger'
                    }`}>
                      {product.stock > 0 ? 'متوفر' : 'نفذت الكمية'}
                    </span>
                  </div>

                  <div className="admin-flex admin-gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="admin-btn admin-btn-sm admin-btn-outline flex-1"
                    >
                      <FiEdit2 size={16} />
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="admin-btn-icon-sm admin-btn-danger"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>الفئة</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-flex admin-items-center admin-gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images?.[0] ? (
                              product.images[0].startsWith('data:image') || product.images[0].startsWith('http') ? (
                                <img src={product.images[0]} alt={product.nameAr} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{product.images[0]}</span>
                              )
                            ) : (
                              <span className="text-xl">📱</span>
                            )}
                          </div>
                          <div>
                            <p className="admin-font-bold">{product.nameAr}</p>
                            <p className="admin-text-sm admin-text-gray">#{product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-text-gray">{product.category}</td>
                      <td className="admin-font-bold">{product.price.toLocaleString()} ر.س</td>
                      <td>
                        <span className={`admin-font-bold ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 20 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${
                          product.stock > 0 ? 'admin-badge-success' : 'admin-badge-danger'
                        }`}>
                          {product.stock > 0 ? 'متوفر' : 'نفذت الكمية'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-flex admin-gap-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="admin-btn-icon-sm admin-btn-outline"
                          >
                            <FiEdit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="admin-btn-icon-sm admin-btn-danger"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-flex admin-items-center admin-justify-between admin-mt-6 admin-p-4 bg-white rounded-lg">
                <div className="admin-text-sm admin-text-gray">
                  عرض {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} من {filteredProducts.length}
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
                      // Show first page, last page, current page, and pages around current
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
