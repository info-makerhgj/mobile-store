'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import { FiX, FiPlus, FiAlertCircle, FiImage, FiTrash2 } from 'react-icons/fi'

// Function to compress image
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height
            height = maxWidth
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        
        // Fill with white background for transparent images
        if (ctx) {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
        }

        // Convert to base64 with compression (use PNG for transparency, JPEG for smaller size)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedBase64)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { loading: authLoading, isAdmin } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // 1. Basic Info
  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [tagline, setTagline] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stock, setStock] = useState('')
  const [warranty, setWarranty] = useState('')
  const [category, setCategory] = useState('')

  // Fetch categories
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error loading categories:', err))
  }, [])

  // 2. Images (dynamic - unlimited)
  const [images, setImages] = useState<string[]>([''])

  // 3. Colors & Storage (as arrays)
  const [colors, setColors] = useState<string[]>([''])
  const [storage, setStorage] = useState<string[]>([''])

  // 4. Quick Features (4 boxes)
  const [quickFeatures, setQuickFeatures] = useState([
    { icon: '⚡', title: '', value: '' },
    { icon: '📸', title: '', value: '' },
    { icon: '🔋', title: '', value: '' },
    { icon: '🛡️', title: '', value: '' },
  ])

  // 5. Features (المميزات الاستثنائية - 4 sections with rich content)
  const [features, setFeatures] = useState([
    { title: '', description: '', image: '', gradient: 'from-blue-500 to-cyan-500' },
    { title: '', description: '', image: '', gradient: 'from-purple-500 to-pink-500' },
    { title: '', description: '', image: '', gradient: 'from-orange-500 to-red-500' },
    { title: '', description: '', image: '', gradient: 'from-green-500 to-emerald-500' },
  ])

  // 6. Specs (المواصفات التقنية - 6 tables)
  const [specs, setSpecs] = useState({
    screen: [
      { label: 'الحجم', value: '' },
      { label: 'النوع', value: '' },
      { label: 'الدقة', value: '' },
      { label: 'معدل التحديث', value: '' },
    ],
    performance: [
      { label: 'المعالج', value: '' },
      { label: 'الرام', value: '' },
      { label: 'التخزين', value: '' },
      { label: 'نظام التشغيل', value: '' },
    ],
    camera: [
      { label: 'الخلفية الرئيسية', value: '' },
      { label: 'الخلفية الواسعة', value: '' },
      { label: 'الأمامية', value: '' },
      { label: 'الفيديو', value: '' },
    ],
    battery: [
      { label: 'السعة', value: '' },
      { label: 'الشحن السلكي', value: '' },
      { label: 'الشحن اللاسلكي', value: '' },
      { label: 'الشحن العكسي', value: '' },
    ],
    connectivity: [
      { label: '5G', value: '' },
      { label: 'WiFi', value: '' },
      { label: 'Bluetooth', value: '' },
      { label: 'NFC', value: '' },
    ],
    design: [
      { label: 'الأبعاد', value: '' },
      { label: 'الوزن', value: '' },
      { label: 'المواد', value: '' },
      { label: 'مقاومة الماء', value: '' },
    ],
  })

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        if (response.ok) {
          const product = await response.json()
          
          console.log('🔍 Fetched product:', product)
          console.log('🎨 Colors from DB:', product.colors)
          console.log('💾 Storage from DB:', product.storage)
          console.log('⚡ Quick Features from DB:', product.quickFeatures)
          console.log('✨ Features from DB:', product.features)
          
          // Set basic info
          setNameAr(product.nameAr || '')
          setNameEn(product.nameEn || '')
          setTagline(product.tagline || '')
          setBrand(product.brand || '')
          setPrice(product.price?.toString() || '')
          setOriginalPrice(product.originalPrice?.toString() || '')
          setStock(product.stock?.toString() || '')
          setWarranty(product.warranty || '')
          setCategory(product.category || 'smartphones')
          
          // Set images (dynamic - keep all existing images)
          const productImages = product.images || []
          setImages(productImages.length > 0 ? productImages : [''])
          
          // Set colors and storage
          setColors(product.colors?.length > 0 ? product.colors : [''])
          setStorage(product.storage?.length > 0 ? product.storage : [''])
          
          // Set quick features (ensure 4 items)
          if (product.quickFeatures && product.quickFeatures.length > 0) {
            const qf = product.quickFeatures
            setQuickFeatures([
              qf[0] || { icon: '⚡', title: '', value: '' },
              qf[1] || { icon: '📸', title: '', value: '' },
              qf[2] || { icon: '🔋', title: '', value: '' },
              qf[3] || { icon: '🛡️', title: '', value: '' },
            ])
          }
          
          // Set features
          if (product.features && product.features.length > 0) {
            setFeatures(product.features)
          }
          
          // Set specifications
          if (product.specifications) {
            const defaultSpecs = {
              screen: [
                { label: 'الحجم', value: '' },
                { label: 'النوع', value: '' },
                { label: 'الدقة', value: '' },
                { label: 'معدل التحديث', value: '' },
              ],
              performance: [
                { label: 'المعالج', value: '' },
                { label: 'الرام', value: '' },
                { label: 'التخزين', value: '' },
                { label: 'نظام التشغيل', value: '' },
              ],
              camera: [
                { label: 'الخلفية الرئيسية', value: '' },
                { label: 'الخلفية الواسعة', value: '' },
                { label: 'الأمامية', value: '' },
                { label: 'الفيديو', value: '' },
              ],
              battery: [
                { label: 'السعة', value: '' },
                { label: 'الشحن السلكي', value: '' },
                { label: 'الشحن اللاسلكي', value: '' },
                { label: 'الشحن العكسي', value: '' },
              ],
              connectivity: [
                { label: '5G', value: '' },
                { label: 'WiFi', value: '' },
                { label: 'Bluetooth', value: '' },
                { label: 'NFC', value: '' },
              ],
              design: [
                { label: 'الأبعاد', value: '' },
                { label: 'الوزن', value: '' },
                { label: 'المواد', value: '' },
                { label: 'مقاومة الماء', value: '' },
              ],
            }
            
            setSpecs({
              screen: product.specifications.screen || defaultSpecs.screen,
              performance: product.specifications.performance || defaultSpecs.performance,
              camera: product.specifications.camera || defaultSpecs.camera,
              battery: product.specifications.battery || defaultSpecs.battery,
              connectivity: product.specifications.connectivity || defaultSpecs.connectivity,
              design: product.specifications.design || defaultSpecs.design,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('فشل تحميل بيانات المنتج')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const productData = {
        nameAr,
        nameEn,
        tagline,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: parseInt(stock),
        warranty,
        category,
        condition: 'NEW',
        descriptionAr: tagline,
        descriptionEn: tagline,
        images: images.filter(img => img.trim() !== ''),
        colors: colors.filter(c => c.trim() !== ''),
        storage: storage.filter(s => s.trim() !== ''),
        quickFeatures: quickFeatures.filter(f => f.title && f.value),
        features: features.filter(f => f.title && f.description),
        specifications: {
          screen: specs.screen.filter(s => s.value),
          performance: specs.performance.filter(s => s.value),
          camera: specs.camera.filter(s => s.value),
          battery: specs.battery.filter(s => s.value),
          connectivity: specs.connectivity.filter(s => s.value),
          design: specs.design.filter(s => s.value),
        },
      }

      console.log('📤 Sending product data:', productData)
      console.log('🎨 Colors:', productData.colors)
      console.log('💾 Storage:', productData.storage)
      console.log('⚡ Quick Features:', productData.quickFeatures)
      console.log('✨ Features:', productData.features)
      
      // Alert if important data is missing
      if (productData.colors.length === 0) {
        alert('⚠️ تحذير: لم يتم إضافة ألوان!')
      }
      if (productData.storage.length === 0) {
        alert('⚠️ تحذير: لم يتم إضافة سعات!')
      }
      if (productData.features.length === 0) {
        alert('⚠️ تحذير: لم يتم إضافة ميزات استثنائية!')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'فشل تحديث المنتج')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/products')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحديث المنتج')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <AdminLayout>
      <div className="admin-page">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">تعديل المنتج</h1>
            <p className="text-gray-600">نموذج كامل مع محرر المميزات</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-600 font-bold">✅ تم تحديث المنتج بنجاح! جاري التحويل...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. المعلومات الأساسية */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">1️⃣ المعلومات الأساسية</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم بالعربي *</label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="أبعاد X برو"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الاسم بالإنجليزي *</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Abaad X Pro"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">الشعار (Tagline) *</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="قوة الأداء. جمال التصميم."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">العلامة التجارية *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Abaad"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الفئة *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  >
                    {categories.length === 0 ? (
                      <option value="">جاري التحميل...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">السعر (قبل الضريبة) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    placeholder="2999"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 <strong>ملاحظة:</strong> السعر المدخل هو سعر المنتج قبل الضريبة. سيتم إضافة ضريبة القيمة المضافة (15%) تلقائياً عند الدفع.
                    <br />
                    <span className="text-primary-600 font-medium">
                      {price && !isNaN(parseFloat(price)) ? (
                        <>السعر النهائي للعميل: {(parseFloat(price) * 1.15).toFixed(2)} ريال (شامل الضريبة)</>
                      ) : (
                        'أدخل السعر لرؤية السعر النهائي'
                      )}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">السعر الأصلي (قبل الخصم)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    step="0.01"
                    placeholder="3499"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    اختياري - لعرض نسبة الخصم (يجب أن يكون أكبر من السعر الحالي)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الكمية *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="45"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الضمان *</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="سنتان"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. الصور */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">2️⃣ الصور ({images.filter(img => img).length} صورة)</h2>
                <button
                  type="button"
                  onClick={() => setImages([...images, ''])}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <FiPlus size={18} />
                  <span>إضافة صورة</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    {/* Preview */}
                    {image ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        {image.startsWith('data:image') || image.startsWith('http') ? (
                          <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-4xl">
                            {image}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = images.filter((_, i) => i !== index)
                            setImages(newImages.length > 0 ? newImages : [''])
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs">
                          {index + 1}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-primary-400 transition">
                        <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                          <FiImage size={24} className="text-gray-400" />
                          <span className="text-xs text-gray-500 text-center">رفع صورة</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                try {
                                  const compressed = await compressImage(file, 800, 0.7)
                                  const newImages = [...images]
                                  newImages[index] = compressed
                                  setImages(newImages)
                                } catch (error) {
                                  console.error('Error compressing image:', error)
                                  alert('فشل ضغط الصورة')
                                }
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          onChange={(e) => {
                            const newImages = [...images]
                            newImages[index] = e.target.value
                            setImages(newImages)
                          }}
                          placeholder="📱"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                💡 يمكنك إضافة عدد غير محدود من الصور. الصورة الأولى ستكون الصورة الرئيسية.
              </p>
            </div>

            {/* 3. الألوان والسعات */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">3️⃣ الألوان والسعات</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* الألوان */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold">الألوان *</label>
                    <button
                      type="button"
                      onClick={() => setColors([...colors, ''])}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      <FiPlus size={14} />
                      <span>إضافة</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {colors.map((color, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...colors]
                            newColors[index] = e.target.value
                            setColors(newColors)
                          }}
                          placeholder="أسود"
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                          required={index === 0}
                        />
                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = colors.filter((_, i) => i !== index)
                              setColors(newColors)
                            }}
                            className="px-3 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                          >
                            <FiX size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* السعات */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold">السعات *</label>
                    <button
                      type="button"
                      onClick={() => setStorage([...storage, ''])}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      <FiPlus size={14} />
                      <span>إضافة</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {storage.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => {
                            const newStorage = [...storage]
                            newStorage[index] = e.target.value
                            setStorage(newStorage)
                          }}
                          placeholder="128GB"
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                          required={index === 0}
                        />
                        {storage.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newStorage = storage.filter((_, i) => i !== index)
                              setStorage(newStorage)
                            }}
                            className="px-3 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                          >
                            <FiX size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. المميزات السريعة */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">4️⃣ المميزات السريعة (4 مربعات)</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {quickFeatures.map((feature, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-2">الأيقونة</label>
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [...quickFeatures]
                            newFeatures[index].icon = e.target.value
                            setQuickFeatures(newFeatures)
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-2xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2">العنوان</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...quickFeatures]
                            newFeatures[index].title = e.target.value
                            setQuickFeatures(newFeatures)
                          }}
                          placeholder="شحن سريع"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2">القيمة</label>
                        <input
                          type="text"
                          value={feature.value}
                          onChange={(e) => {
                            const newFeatures = [...quickFeatures]
                            newFeatures[index].value = e.target.value
                            setQuickFeatures(newFeatures)
                          }}
                          placeholder="65W"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. المميزات الاستثنائية (المحرر) */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">5️⃣ المميزات الاستثنائية</h2>
                  <p className="text-sm text-gray-600 mt-1">هذه الأقسام تظهر في صفحة المنتج كمميزات كبيرة مع صور ووصف</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeatures([...features, { 
                      title: '', 
                      description: '', 
                      image: '', 
                      gradient: 'from-blue-500 to-cyan-500' 
                    }])
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <FiPlus size={18} />
                  <span>إضافة ميزة</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">ميزة {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl overflow-hidden`}>
                          {feature.image ? (
                            feature.image.startsWith('data:image') || feature.image.startsWith('http') ? (
                              <img src={feature.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{feature.image}</span>
                            )
                          ) : (
                            '🎯'
                          )}
                        </div>
                        {features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = features.filter((_, i) => i !== index)
                              setFeatures(newFeatures)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">العنوان *</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...features]
                            newFeatures[index].title = e.target.value
                            setFeatures(newFeatures)
                          }}
                          placeholder="شاشة AMOLED الرائعة"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">الوصف *</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...features]
                            newFeatures[index].description = e.target.value
                            setFeatures(newFeatures)
                          }}
                          placeholder="استمتع بألوان نابضة بالحياة ووضوح استثنائي مع شاشة 6.8 بوصة بدقة 2K+ ومعدل تحديث 120Hz"
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">الأيقونة/الصورة</label>
                        
                        {/* Preview */}
                        {feature.image && (
                          <div className="mb-3 relative w-32 h-32 mx-auto">
                            {feature.image.startsWith('data:image') || feature.image.startsWith('http') ? (
                              <img src={feature.image} alt="صورة الميزة" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center text-5xl">
                                {feature.image}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...features]
                                newFeatures[index].image = ''
                                setFeatures(newFeatures)
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <label className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-300 text-primary-600 rounded-xl hover:bg-primary-50 transition">
                              <FiImage size={18} />
                              <span>رفع صورة</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  try {
                                    // Compress image before saving
                                    const compressed = await compressImage(file, 600, 0.7)
                                    const newFeatures = [...features]
                                    newFeatures[index].image = compressed
                                    setFeatures(newFeatures)
                                  } catch (error) {
                                    console.error('Error compressing image:', error)
                                    alert('فشل ضغط الصورة')
                                  }
                                }
                              }}
                            />
                          </label>
                          
                          <input
                            type="text"
                            value={feature.image.startsWith('data:image') ? '' : feature.image}
                            onChange={(e) => {
                              const newFeatures = [...features]
                              newFeatures[index].image = e.target.value
                              setFeatures(newFeatures)
                            }}
                            placeholder="🖥️"
                            className="w-20 px-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. المواصفات التقنية */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">6️⃣ المواصفات التقنية (6 جداول)</h2>
              
              <div className="space-y-8">
                {/* الشاشة */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">الشاشة</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.screen.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.screen[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          placeholder={spec.label === 'الحجم' ? '6.8 بوصة' : ''}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* المعالج والأداء */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">المعالج والأداء</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.performance.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.performance[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* الكاميرا */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">الكاميرا</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.camera.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.camera[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* البطارية والشحن */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">البطارية والشحن</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.battery.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.battery[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* الاتصال */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">الاتصال</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.connectivity.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.connectivity[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          placeholder="مدعوم"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* التصميم */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-primary-600">التصميم</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specs.design.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm font-bold mb-2">{spec.label}</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = { ...specs }
                            newSpecs.design[index].value = e.target.value
                            setSpecs(newSpecs)
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'جاري التحديث...' : '✅ حفظ التغييرات'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
            </div>
          </form>
      </div>
    </AdminLayout>
  )
}
