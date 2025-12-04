'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface Category {
  _id: string
  name: string
  slug: string
  icon: string
  order: number
}

export default function CategoriesPage() {
  const { loading: authLoading, isAdmin } = useAdminAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📱',
    order: 0
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingId ? 'تم تحديث الفئة بنجاح' : 'تم إضافة الفئة بنجاح')
        fetchCategories()
        resetForm()
      } else {
        const data = await response.json()
        alert(data.message || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('حدث خطأ في الحفظ')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم حذف الفئة بنجاح')
        fetchCategories()
      } else {
        alert('حدث خطأ في الحذف')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('حدث خطأ في الحذف')
    }
  }

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingId(category._id)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      order: category.order
    })
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      icon: '📱',
      order: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    })
  }

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="text-center py-12">جاري التحميل...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">إدارة الفئات</h1>
            <p className="admin-header-subtitle">{categories.length} فئة</p>
          </div>
          <div className="admin-header-actions">
            <button
              onClick={() => setShowForm(true)}
              className="admin-btn admin-btn-primary"
            >
              <FiPlus size={18} />
              <span>إضافة فئة</span>
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h2>
                <button 
                  onClick={resetForm} 
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    اسم الفئة
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="مثال: الجوالات"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرابط المختصر (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="مثال: smartphones"
                    required
                    dir="ltr"
                    style={{ textAlign: 'left' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سيظهر في الرابط: /products?category={formData.slug}
                  </p>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الأيقونة (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition text-center text-2xl"
                    placeholder="📱"
                    maxLength={2}
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    الرقم الأصغر يظهر أولاً
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FiSave size={18} />
                    <span>{editingId ? 'حفظ التعديلات' : 'إضافة الفئة'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الأيقونة</th>
                  <th>اسم الفئة</th>
                  <th>Slug</th>
                  <th>الترتيب</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      لا توجد فئات. اضغط "إضافة فئة" للبدء
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td>
                        <span className="text-3xl">{category.icon}</span>
                      </td>
                      <td>
                        <span className="font-semibold text-gray-900">{category.name}</span>
                      </td>
                      <td>
                        <code className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                          {category.slug}
                        </code>
                      </td>
                      <td>
                        <span className="text-gray-600 font-medium">{category.order}</span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="admin-btn-icon admin-btn-icon-edit"
                            title="تعديل"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="admin-btn-icon admin-btn-icon-delete"
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>ملاحظات مهمة</span>
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>الـ Slug يجب أن يكون بالإنجليزي وبدون مسافات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>تأكد من تطابق الـ Slug مع حقل category في المنتجات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>الترتيب يحدد ظهور الفئات في القائمة (الأصغر أولاً)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>الأيقونات تدعم Emoji فقط</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
