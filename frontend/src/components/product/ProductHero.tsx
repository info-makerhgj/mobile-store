'use client'

import { useState, useEffect } from 'react'
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'
import Toast from '@/components/ui/Toast'
import Price from '@/components/ui/Price'

const imageColors = [
  'from-slate-100 to-gray-100',
  'from-blue-100 to-blue-50',
  'from-purple-100 to-purple-50',
  'from-pink-100 to-pink-50',
  'from-orange-100 to-orange-50',
  'from-green-100 to-green-50',
]

export default function ProductHero({ productId }: { productId: string }) {
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Product data:', data)
          console.log('Colors:', data.colors)
          console.log('Storage:', data.storage)
          setProduct(data)
          if (data.colors?.length > 0) setSelectedColor(data.colors[0])
          if (data.storage?.length > 0) setSelectedStorage(data.storage[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    // تحقق من المفضلة في localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(productId))
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.nameAr,
        price: product.price,
        image: product.images?.[0] || '📱',
        quantity: 1,
        color: selectedColor,
        storage: selectedStorage,
      })
      setToastMessage('✓ تم إضافة المنتج للسلة بنجاح')
      setShowToast(true)
    }
  }

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {
      // إزالة من المفضلة
      const newFavorites = favorites.filter((id: string) => id !== productId)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      setIsFavorite(false)
      setToastMessage('تم إزالة المنتج من المفضلة')
    } else {
      // إضافة للمفضلة
      favorites.push(productId)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setIsFavorite(true)
      setToastMessage('❤️ تم إضافة المنتج للمفضلة')
    }
    setShowToast(true)
  }

  const handleShare = async () => {
    const shareData = {
      title: product?.nameAr || 'منتج',
      text: `${product?.nameAr} - ${product?.price} ر.س`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        // استخدام Web Share API للجوال
        await navigator.share(shareData)
        setToastMessage('✓ تم المشاركة بنجاح')
        setShowToast(true)
      } else {
        // نسخ الرابط للحافظة
        await navigator.clipboard.writeText(window.location.href)
        setToastMessage('✓ تم نسخ الرابط')
        setShowToast(true)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (loading) {
    return (
      <section className="relative min-h-[600px] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="relative min-h-[600px] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">المنتج غير موجود</p>
        </div>
      </section>
    )
  }

  // Create image objects from product images
  const productImages = product.images?.map((img: string, i: number) => ({
    icon: img,
    color: imageColors[i % imageColors.length],
  })) || [{ icon: '📱', color: 'from-slate-100 to-gray-100' }]

  return (
    <section className="relative min-h-[600px] md:min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20">
          {/* Product Image */}
          <div className="relative space-y-3 md:space-y-4 order-1 lg:order-none w-full">
            {/* Main Image */}
            <div className={`relative bg-gradient-to-br ${productImages[selectedImageIndex].color} rounded-2xl md:rounded-3xl aspect-square flex items-center justify-center overflow-hidden`}>
              {productImages[selectedImageIndex].icon?.startsWith('data:image') || productImages[selectedImageIndex].icon?.startsWith('http') ? (
                <img 
                  src={productImages[selectedImageIndex].icon} 
                  alt={product.nameAr}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[10rem] md:text-9xl lg:text-[12rem] animate-float">
                  {productImages[selectedImageIndex].icon}
                </div>
              )}
              {/* Floating Badges */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-primary-600 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-xl">
                جديد
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-xl">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
              {/* Image Counter */}
              <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                {selectedImageIndex + 1}/{product.images.length}
              </div>
            </div>

            {/* Thumbnails Slider */}
            <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
              <div 
                className="flex gap-2 md:gap-3 overflow-x-scroll pb-2 scrollbar-hide"
                style={{ 
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {productImages.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br ${img.color} flex items-center justify-center hover:ring-2 hover:ring-primary-600 transition overflow-hidden ${
                      i === selectedImageIndex ? 'ring-2 ring-primary-600' : 'ring-1 ring-gray-200'
                    }`}
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    {img.icon?.startsWith('data:image') || img.icon?.startsWith('http') ? (
                      <img src={img.icon} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl md:text-2xl">{img.icon}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3 md:space-y-6 text-right order-2 lg:order-none w-full">
            <div>
              <p className="text-primary-600 text-xs md:text-sm font-bold mb-1 md:mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-3 leading-tight">
                {product.nameAr}
              </h1>
              {product.tagline && (
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 font-light">
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-4xl font-bold text-primary-600">
                <Price value={product.price} />
              </span>
              {product.originalPrice && (
                <span className="text-base md:text-xl text-gray-400 line-through">
                  <Price value={product.originalPrice} />
                </span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm md:text-base font-bold mb-2">اللون: {selectedColor}</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color: string, index: number) => (
                  <button
                    key={`${color}-${index}`}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 text-xs md:text-sm transition ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                  >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storage && product.storage.length > 0 && (
              <div>
                <p className="text-sm md:text-base font-bold mb-2">السعة: {selectedStorage}</p>
                <div className="flex gap-2">
                  {product.storage.map((size: string, index: number) => (
                  <button
                    key={`${size}-${index}`}
                    onClick={() => setSelectedStorage(size)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 text-xs md:text-sm transition ${
                      selectedStorage === size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                  >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary-600 text-white py-3 md:py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-primary-700 transition flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={18} className="md:w-5 md:h-5" />
                أضف للسلة
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`w-11 h-11 md:w-12 md:h-12 border-2 rounded-full flex items-center justify-center transition ${
                  isFavorite 
                    ? 'bg-red-50 border-red-500 text-red-500' 
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <FiHeart size={18} className={`md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className="w-11 h-11 md:w-12 md:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-primary-600 hover:text-primary-600 transition"
                aria-label="مشاركة المنتج"
              >
                <FiShare2 size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Features List */}
            {product.quickFeatures && product.quickFeatures.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 md:pt-6 border-t">
                {product.quickFeatures.map((feature: any, index: number) => (
                  <div key={index} className="text-center p-4 md:p-4 bg-gray-50 rounded-xl">
                    <p className="text-3xl md:text-3xl mb-2 md:mb-2">{feature.icon}</p>
                    <p className="text-sm md:text-base font-bold">{feature.title}</p>
                    <p className="text-sm md:text-sm text-gray-600">{feature.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  )
}
