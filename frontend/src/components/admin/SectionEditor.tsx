'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash2, FiUpload, FiEye } from 'react-icons/fi'
import SectionPreview from './SectionPreview'
import ImageUploadGuide from './ImageUploadGuide'
import ResponsiveImagePreview from './ResponsiveImagePreview'

interface SectionEditorProps {
  section?: any
  onSave: (data: any) => void
  onClose: () => void
  products?: any[]
}

export default function SectionEditor({ section, onSave, onClose, products = [] }: SectionEditorProps) {
  const [sectionType, setSectionType] = useState(section?.type || 'hero')
  const [formData, setFormData] = useState({
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    settings: section?.settings || {},
    content: section?.content || {},
  })
  const [showPreview, setShowPreview] = useState(true)

  // Create preview data
  const previewData = {
    type: sectionType,
    title: formData.title,
    subtitle: formData.subtitle,
    content: formData.content,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      type: sectionType,
      ...formData,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [field]: base64,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit} className="flex h-full max-h-[90vh]">
          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{section ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
                <p className="text-primary-100 text-sm mt-1">املأ البيانات أدناه لإنشاء قسم جديد</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 hover:bg-white/20 rounded-lg transition text-white flex items-center gap-2"
                  title={showPreview ? 'إخفاء المعاينة' : 'إظهار المعاينة'}
                >
                  <FiEye size={20} />
                  <span className="text-sm hidden md:inline">{showPreview ? 'إخفاء' : 'معاينة'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section Type */}
            {!section && (
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-4 border-2 border-primary-200">
                <label className="block text-sm font-bold mb-3 text-gray-800">نوع القسم</label>
                <select
                  value={sectionType}
                  onChange={(e) => setSectionType(e.target.value)}
                  className="w-full border-2 border-primary-300 rounded-lg px-4 py-3 text-base font-medium focus:border-primary-500 focus:outline-none bg-white"
                  required
                >
                  <option value="hero">🎯 بنر رئيسي (Hero Slider)</option>
                  <option value="categories">📂 فئات المنتجات</option>
                  <option value="products">📱 عرض منتجات</option>
                  <option value="banner">🎨 بنر إعلاني</option>
                  <option value="text">📝 قسم نصي</option>
                  <option value="imageGrid">🖼️ شبكة صور</option>
                  <option value="exclusiveOffers">🎁 عروض حصرية</option>
                  <option value="deals">🔥 العروض الأسبوعية</option>
                </select>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800">
                  عنوان القسم <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary-500 focus:outline-none"
                  placeholder="مثال: أحدث المنتجات"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 يمكنك ترك العنوان فارغاً إذا كنت تريد عرض المحتوى فقط
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800">عنوان فرعي (اختياري)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-primary-500 focus:outline-none"
                  placeholder="مثال: اكتشف أفضل العروض والمنتجات"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-6"></div>

            {/* Type-specific fields */}
            {sectionType === 'hero' && <HeroFields formData={formData} setFormData={setFormData} />}
            {sectionType === 'categories' && <CategoriesFields formData={formData} setFormData={setFormData} />}
            {sectionType === 'products' && (
              <ProductsFields formData={formData} setFormData={setFormData} products={products} />
            )}
            {sectionType === 'banner' && (
              <BannerFields formData={formData} setFormData={setFormData} onImageUpload={handleImageUpload} />
            )}
            {sectionType === 'text' && <TextFields formData={formData} setFormData={setFormData} />}
            {sectionType === 'imageGrid' && (
              <ImageGridFields formData={formData} setFormData={setFormData} onImageUpload={handleImageUpload} />
            )}
            {sectionType === 'exclusiveOffers' && <ExclusiveOffersFields />}
            {sectionType === 'deals' && <DealsFields />}
          </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t-2 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition font-bold shadow-lg"
              >
                {section ? '💾 حفظ التعديلات' : '✨ إضافة القسم'}
              </button>
            </div>
          </div>

          {/* Left Side - Preview */}
          {showPreview && (
            <div className="w-96 bg-gray-100 border-r-2 border-gray-200 overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white z-10">
                <div className="flex items-center gap-2">
                  <FiEye size={18} />
                  <h3 className="font-bold">معاينة مباشرة</h3>
                </div>
                <p className="text-xs text-blue-100 mt-1">شاهد كيف سيظهر القسم</p>
              </div>
              <div className="p-4">
                <SectionPreview section={previewData} products={products} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

// Hero Section Fields
function HeroFields({ formData, setFormData }: any) {
  const [slides, setSlides] = useState(formData.content.slides || [{ image: '', mobileImage: '', link: '' }])

  const addSlide = () => {
    const newSlides = [...slides, { image: '', mobileImage: '', link: '' }]
    setSlides(newSlides)
    setFormData({ ...formData, content: { ...formData.content, slides: newSlides } })
  }

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSlides(newSlides)
    setFormData({ ...formData, content: { ...formData.content, slides: newSlides } })
  }

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_: any, i: number) => i !== index)
    setSlides(newSlides)
    setFormData({ ...formData, content: { ...formData.content, slides: newSlides } })
  }

  const handleImageUpload = (index: number, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateSlide(index, field, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold">الشرائح</label>
        <button type="button" onClick={addSlide} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
          <FiPlus size={16} />
          إضافة شريحة
        </button>
      </div>

      {slides.map((slide: any, index: number) => (
        <div key={index} className="border-2 border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-base text-primary-600">شريحة {index + 1}</span>
            {slides.length > 1 && (
              <button type="button" onClick={() => removeSlide(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <FiTrash2 size={18} />
              </button>
            )}
          </div>

          {/* صورة الكمبيوتر */}
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">
              🖥️ صورة الكمبيوتر <span className="text-red-500">*</span>
            </label>
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 transition text-center bg-white">
                {slide.image ? (
                  <div className="space-y-2">
                    <img src={slide.image} alt="Desktop Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                    <p className="text-xs text-primary-600 font-bold">اضغط لتغيير الصورة</p>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-xs text-gray-600 font-bold">صورة للشاشات الكبيرة</p>
                    <p className="text-xs text-gray-500">مقاس مقترح: 1920x600</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, 'image', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* صورة الجوال */}
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">
              📱 صورة الجوال <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 transition text-center bg-white">
                {slide.mobileImage ? (
                  <div className="space-y-2">
                    <img src={slide.mobileImage} alt="Mobile Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                    <p className="text-xs text-primary-600 font-bold">اضغط لتغيير الصورة</p>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-xs text-gray-600 font-bold">صورة للجوالات</p>
                    <p className="text-xs text-gray-500">مقاس مقترح: 800x1000</p>
                    <p className="text-xs text-gray-400 mt-1">إذا تركتها فارغة، ستظهر صورة الكمبيوتر</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, 'mobileImage', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* الرابط */}
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">
              🔗 الرابط (عند الضغط على الصورة) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slide.link}
              onChange={(e) => updateSlide(index, 'link', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="/products أو /products?category=phones"
              required
            />
            <p className="text-xs text-gray-500 mt-1">💡 الصورة كاملة قابلة للضغط وتوديك للرابط مباشرة</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Categories Fields
function CategoriesFields({ formData, setFormData }: any) {
  const [categories, setCategories] = useState(
    formData.content.categories || [{ name: '', icon: '', link: '' }]
  )

  const addCategory = () => {
    const newCategories = [...categories, { name: '', icon: '', link: '' }]
    setCategories(newCategories)
    setFormData({ ...formData, content: { ...formData.content, categories: newCategories } })
  }

  const updateCategory = (index: number, field: string, value: string) => {
    const newCategories = [...categories]
    newCategories[index] = { ...newCategories[index], [field]: value }
    setCategories(newCategories)
    setFormData({ ...formData, content: { ...formData.content, categories: newCategories } })
  }

  const removeCategory = (index: number) => {
    const newCategories = categories.filter((_: any, i: number) => i !== index)
    setCategories(newCategories)
    setFormData({ ...formData, content: { ...formData.content, categories: newCategories } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold">الفئات</label>
        <button type="button" onClick={addCategory} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
          <FiPlus size={16} />
          إضافة فئة
        </button>
      </div>

      {categories.map((category: any, index: number) => (
        <div key={index} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-base text-primary-600">فئة {index + 1}</span>
            {categories.length > 1 && (
              <button type="button" onClick={() => removeCategory(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <FiTrash2 size={18} />
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">اسم الفئة</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => updateCategory(index, 'name', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="مثال: هواتف"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">أيقونة (emoji)</label>
            <input
              type="text"
              value={category.icon}
              onChange={(e) => updateCategory(index, 'icon', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none text-2xl text-center"
              placeholder="📱"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">الرابط</label>
            <input
              type="text"
              value={category.link}
              onChange={(e) => updateCategory(index, 'link', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="/products?category=phones"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Products Fields
function ProductsFields({ formData, setFormData, products }: any) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(formData.content.productIds || [])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleProduct = (productId: string) => {
    const newSelected = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId]

    setSelectedProducts(newSelected)
    setFormData({ ...formData, content: { ...formData.content, productIds: newSelected } })
  }

  const filteredProducts = products.filter((product: any) =>
    (product.nameAr || product.name).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">اختر المنتجات</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none mb-3"
          placeholder="🔍 ابحث عن منتج..."
        />
      </div>

      <div className="border-2 border-gray-200 rounded-lg max-h-80 overflow-y-auto bg-white">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p>لا توجد منتجات</p>
          </div>
        ) : (
          filteredProducts.map((product: any) => (
            <label
              key={product._id}
              className="flex items-center gap-3 p-3 hover:bg-primary-50 cursor-pointer border-b last:border-b-0 transition"
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(product._id)}
                onChange={() => toggleProduct(product._id)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.nameAr || product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="font-bold text-sm">{product.nameAr || product.name}</div>
                <div className="text-xs text-gray-600">{product.price?.toLocaleString()} ر.س</div>
              </div>
              {selectedProducts.includes(product._id) && (
                <span className="text-primary-600 font-bold text-xs bg-primary-50 px-2 py-1 rounded">
                  ✓ محدد
                </span>
              )}
            </label>
          ))
        )}
      </div>

      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-3 text-center">
        <span className="text-primary-600 font-bold">تم اختيار {selectedProducts.length} منتج</span>
      </div>
    </div>
  )
}

// Banner Fields
function BannerFields({ formData, setFormData, onImageUpload }: any) {
  return (
    <div className="space-y-4">
      {/* صورة الكمبيوتر */}
      <div>
        <label className="block text-sm font-bold mb-2 text-gray-700">
          🖥️ صورة الكمبيوتر <span className="text-red-500">*</span>
        </label>
        
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-primary-500 transition text-center bg-gray-50">
            {formData.content.image ? (
              <div className="space-y-3">
                <img src={formData.content.image} alt="Desktop Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                <p className="text-sm text-primary-600 font-bold">اضغط لتغيير الصورة</p>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="text-sm text-gray-600 font-bold mb-1">صورة للشاشات الكبيرة</p>
                <p className="text-xs text-gray-500">مقاس مقترح: 1920x400 | PNG, JPG, WebP</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload(e, 'image')}
            className="hidden"
          />
        </label>
      </div>

      {/* صورة الجوال */}
      <div>
        <label className="block text-sm font-bold mb-2 text-gray-700">
          📱 صورة الجوال <span className="text-gray-400 font-normal">(اختياري)</span>
        </label>
        
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 hover:border-purple-500 transition text-center bg-purple-50">
            {formData.content.mobileImage ? (
              <div className="space-y-3">
                <img src={formData.content.mobileImage} alt="Mobile Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                <p className="text-sm text-purple-600 font-bold">اضغط لتغيير الصورة</p>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto mb-3 text-purple-400" size={32} />
                <p className="text-sm text-purple-600 font-bold mb-1">صورة للجوالات</p>
                <p className="text-xs text-purple-500">مقاس مقترح: 800x600 | PNG, JPG, WebP</p>
                <p className="text-xs text-gray-500 mt-2">💡 إذا تركتها فارغة، ستظهر صورة الكمبيوتر</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload(e, 'mobileImage')}
            className="hidden"
          />
        </label>
      </div>

      {/* Responsive Preview */}
      {formData.content.image && (
        <ResponsiveImagePreview imageUrl={formData.content.image} alt="معاينة البنر" />
      )}

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-600 mb-3">
          💡 <strong>اختياري:</strong> يمكنك إضافة زر على البنر أو تركه فارغاً
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">
              نص الزر <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="text"
              value={formData.content.buttonText || ''}
              onChange={(e) => setFormData({ ...formData, content: { ...formData.content, buttonText: e.target.value } })}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="تسوق الآن"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">
              رابط الزر <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="text"
              value={formData.content.buttonLink || ''}
              onChange={(e) => setFormData({ ...formData, content: { ...formData.content, buttonLink: e.target.value } })}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="/products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Text Fields
function TextFields({ formData, setFormData }: any) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-gray-700">المحتوى النصي</label>
      <textarea
        value={formData.content.text || ''}
        onChange={(e) => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
        rows={8}
        placeholder="اكتب المحتوى النصي هنا...&#10;&#10;مثال:&#10;متجر أبعاد التواصل يقدم أفضل المنتجات الإلكترونية بأسعار تنافسية وجودة عالية."
      />
      <p className="text-xs text-gray-500 mt-2">يمكنك كتابة نص طويل أو قصير حسب الحاجة</p>
    </div>
  )
}

// Image Grid Fields
function ImageGridFields({ formData, setFormData, onImageUpload }: any) {
  const [images, setImages] = useState(formData.content.images || [{ image: '', link: '' }])

  const addImage = () => {
    const newImages = [...images, { image: '', link: '' }]
    setImages(newImages)
    setFormData({ ...formData, content: { ...formData.content, images: newImages } })
  }

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    setImages(newImages)
    setFormData({ ...formData, content: { ...formData.content, images: newImages } })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index)
    setImages(newImages)
    setFormData({ ...formData, content: { ...formData.content, images: newImages } })
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateImage(index, 'image', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold">الصور</label>
        <button type="button" onClick={addImage} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
          <FiPlus size={16} />
          إضافة صورة
        </button>
      </div>

      {images.map((img: any, index: number) => (
        <div key={index} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-base text-primary-600">صورة {index + 1}</span>
            {images.length > 1 && (
              <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <FiTrash2 size={18} />
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">الصورة</label>
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition text-center">
                {img.image ? (
                  <div className="space-y-2">
                    <img src={img.image} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                    <p className="text-xs text-primary-600 font-bold">اضغط لتغيير</p>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-xs text-gray-600">اضغط لرفع صورة</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">الرابط (اختياري)</label>
            <input
              type="text"
              value={img.link}
              onChange={(e) => updateImage(index, 'link', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="/products"
            />
          </div>
        </div>
      ))}
    </div>
  )
}


// Exclusive Offers Fields
function ExclusiveOffersFields() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
      <div className="text-center space-y-3">
        <div className="text-5xl">🎁</div>
        <h3 className="text-xl font-bold text-gray-900">قسم العروض الحصرية</h3>
        <p className="text-gray-600 text-sm">
          هذا القسم يعرض 3 بطاقات عروض ثابتة بتصميم جاهز
        </p>
        <div className="bg-white rounded-lg p-4 text-right space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">💎</span>
            <span className="text-gray-700">عرض محدود - خصم 30%</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500">🎁</span>
            <span className="text-gray-700">هدية مجانية - اشتر 2 واحصل على 1</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">⚡</span>
            <span className="text-gray-700">عروض الجمعة البيضاء - خصم يصل إلى 50%</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          💡 لا يحتاج إلى إعدادات إضافية، فقط قم بتفعيله
        </p>
      </div>
    </div>
  )
}

// Deals Fields
function DealsFields() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
      <div className="text-center space-y-3">
        <div className="text-5xl">🔥</div>
        <h3 className="text-xl font-bold text-gray-900">قسم العروض الأسبوعية</h3>
        <p className="text-gray-600 text-sm">
          هذا القسم يعرض المنتجات التي عليها عروض تلقائياً
        </p>
        <div className="bg-white rounded-lg p-4 text-right space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-500">✅</span>
            <span className="text-gray-700">يعرض المنتجات التي لها سعر عرض</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">🏷️</span>
            <span className="text-gray-700">يحسب نسبة الخصم تلقائياً</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500">⏰</span>
            <span className="text-gray-700">يعرض العد التنازلي للعرض</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          💡 لا يحتاج إلى إعدادات إضافية، فقط قم بتفعيله
        </p>
      </div>
    </div>
  )
}
