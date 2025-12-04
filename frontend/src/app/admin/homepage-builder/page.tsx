'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SectionEditor from '@/components/admin/SectionEditor'
import { FiPlus, FiEye, FiEyeOff, FiCopy, FiTrash2, FiChevronUp, FiChevronDown, FiEdit2 } from 'react-icons/fi'

interface Section {
  id: string
  type: 'hero' | 'categories' | 'products' | 'banner' | 'text' | 'imageGrid' | 'exclusiveOffers' | 'deals'
  title: string
  subtitle?: string
  order: number
  active: boolean
  settings: any
  content: any
}

interface HomepageConfig {
  _id: string
  active: boolean
  sections: Section[]
}

export default function HomepageBuilderPage() {
  const router = useRouter()
  const [config, setConfig] = useState<HomepageConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchConfig()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products')
      const data = await res.json()
      const productsList = Array.isArray(data) ? data : (data.products || [])
      setProducts(productsList)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/api/homepage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error fetching config:', error)
      setConfig(null)
    } finally {
      setLoading(false)
    }
  }

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!config) return

    const sections = [...config.sections]
    const index = sections.findIndex((s) => s.id === sectionId)

    if (direction === 'up' && index > 0) {
      ;[sections[index], sections[index - 1]] = [sections[index - 1], sections[index]]
    } else if (direction === 'down' && index < sections.length - 1) {
      ;[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
    }

    sections.forEach((s, i) => (s.order = i + 1))
    await reorderSections(sections)
  }

  const reorderSections = async (sections: Section[]) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/api/homepage/sections/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sections }),
      })
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error reordering sections:', error)
    }
  }

  const toggleSection = async (sectionId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:4000/api/homepage/sections/${sectionId}/toggle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error toggling section:', error)
    }
  }

  const duplicateSection = async (sectionId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:4000/api/homepage/sections/${sectionId}/duplicate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error duplicating section:', error)
    }
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:4000/api/homepage/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🎯'
      case 'categories': return '📂'
      case 'products': return '📱'
      case 'banner': return '🎨'
      case 'text': return '📝'
      case 'imageGrid': return '🖼️'
      case 'exclusiveOffers': return '🎁'
      case 'deals': return '🔥'
      default: return '📦'
    }
  }

  const getSectionTypeName = (type: string) => {
    switch (type) {
      case 'hero': return 'بنر رئيسي'
      case 'categories': return 'فئات'
      case 'products': return 'منتجات'
      case 'banner': return 'بنر'
      case 'text': return 'نص'
      case 'imageGrid': return 'شبكة صور'
      case 'exclusiveOffers': return 'عروض حصرية'
      case 'deals': return 'العروض الأسبوعية'
      default: return type
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">جاري التحميل...</p>
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
            <h1 className="admin-header-title">🎨 إدارة الصفحة الرئيسية</h1>
            <p className="admin-header-subtitle">
              {config?.sections?.length || 0} قسم
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              onClick={() => setShowAddModal(true)}
              className="admin-btn admin-btn-primary"
            >
              <FiPlus size={20} />
              <span className="hidden md:inline">إضافة قسم</span>
            </button>
            <a
              href="/"
              target="_blank"
              className="admin-btn admin-btn-success"
            >
              <FiEye size={20} />
              <span className="hidden md:inline">معاينة</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">إجمالي الأقسام</span>
            <span className="admin-stat-value">{config?.sections?.length || 0}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">الأقسام النشطة</span>
            <span className="admin-stat-value success">
              {config?.sections?.filter(s => s.active).length || 0}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">الأقسام المخفية</span>
            <span className="admin-stat-value danger">
              {config?.sections?.filter(s => !s.active).length || 0}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">حالة الصفحة</span>
            <span className={`admin-stat-value ${config?.active ? 'success' : 'danger'}`}>
              {config?.active ? 'نشطة' : 'معطلة'}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {(!config?.sections || config.sections.length === 0) && (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <h3 className="admin-empty-title">لا توجد أقسام بعد</h3>
            <p className="admin-empty-text">
              ابدأ بإضافة أول قسم للصفحة الرئيسية
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="admin-btn admin-btn-primary mt-4"
            >
              <FiPlus size={20} />
              إضافة أول قسم
            </button>
          </div>
        )}

        {/* Sections List */}
        {config?.sections && config.sections.length > 0 && (
          <div className="space-y-4">
            {config.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={section.id}
                  className={`admin-card ${!section.active ? 'opacity-60' : ''}`}
                >
                  <div className="admin-flex admin-items-center admin-gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {getSectionIcon(section.type)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="admin-flex admin-items-center admin-gap-2 flex-wrap">
                        <h3 className="admin-font-bold admin-text-lg">{section.title}</h3>
                        <span className="admin-badge admin-badge-primary">
                          {getSectionTypeName(section.type)}
                        </span>
                        {!section.active && (
                          <span className="admin-badge admin-badge-danger">
                            مخفي
                          </span>
                        )}
                      </div>
                      {section.subtitle && (
                        <p className="admin-text-sm admin-text-gray mt-1 admin-truncate">
                          {section.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Actions - Desktop */}
                    <div className="hidden md:flex admin-items-center admin-gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                        className="admin-btn-icon-sm admin-btn-outline"
                        title="تحريك لأعلى"
                      >
                        <FiChevronUp size={18} />
                      </button>

                      <button
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === (config?.sections?.length || 0) - 1}
                        className="admin-btn-icon-sm admin-btn-outline"
                        title="تحريك لأسفل"
                      >
                        <FiChevronDown size={18} />
                      </button>

                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`admin-btn-icon-sm ${
                          section.active ? 'admin-btn-success' : 'admin-btn-secondary'
                        }`}
                        title={section.active ? 'إخفاء' : 'إظهار'}
                      >
                        {section.active ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                      </button>

                      <button
                        onClick={() => duplicateSection(section.id)}
                        className="admin-btn-icon-sm admin-btn-outline"
                        title="نسخ"
                      >
                        <FiCopy size={18} />
                      </button>

                      <button
                        onClick={() => setEditingSection(section)}
                        className="admin-btn-icon-sm admin-btn-primary"
                        title="تعديل"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      <button
                        onClick={() => deleteSection(section.id)}
                        className="admin-btn-icon-sm admin-btn-danger"
                        title="حذف"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Actions - Mobile */}
                  <div className="md:hidden mt-4 admin-flex admin-gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="admin-btn admin-btn-sm admin-btn-primary flex-1"
                    >
                      <FiEdit2 size={16} />
                      تعديل
                    </button>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`admin-btn admin-btn-sm ${
                        section.active ? 'admin-btn-success' : 'admin-btn-secondary'
                      }`}
                    >
                      {section.active ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="admin-btn-icon-sm admin-btn-danger"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSection) && (
        <SectionEditor
          section={editingSection}
          products={products}
          onSave={async (data) => {
            try {
              const token = localStorage.getItem('token')
              const url = editingSection
                ? `http://localhost:4000/api/homepage/sections/${editingSection.id}`
                : 'http://localhost:4000/api/homepage/sections'
              const method = editingSection ? 'PUT' : 'POST'

              const res = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
              })

              const updatedConfig = await res.json()
              setConfig(updatedConfig)
              setShowAddModal(false)
              setEditingSection(null)
            } catch (error) {
              console.error('Error saving section:', error)
              alert('حدث خطأ أثناء الحفظ')
            }
          }}
          onClose={() => {
            setShowAddModal(false)
            setEditingSection(null)
          }}
        />
      )}
    </AdminLayout>
  )
}
