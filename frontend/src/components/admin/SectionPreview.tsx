'use client'

import Link from 'next/link'

interface SectionPreviewProps {
  section: any
  products?: any[]
}

export default function SectionPreview({ section, products = [] }: SectionPreviewProps) {
  const renderPreview = () => {
    switch (section.type) {
      case 'hero':
        return <HeroPreview section={section} />
      case 'categories':
        return <CategoriesPreview section={section} />
      case 'products':
        return <ProductsPreview section={section} products={products} />
      case 'banner':
        return <BannerPreview section={section} />
      case 'text':
        return <TextPreview section={section} />
      case 'imageGrid':
        return <ImageGridPreview section={section} />
      default:
        return <div className="text-center text-gray-500 py-8">لا توجد معاينة متاحة</div>
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-gray-700">معاينة القسم</h3>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">مباشر</span>
      </div>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 max-h-96 overflow-y-auto">
        {renderPreview()}
      </div>
    </div>
  )
}

// Hero Preview
function HeroPreview({ section }: { section: any }) {
  const slides = section.content?.slides || []
  const firstSlide = slides[0]

  if (!firstSlide) {
    return <div className="text-center text-gray-500 py-8">أضف شريحة لرؤية المعاينة</div>
  }

  return (
    <div className="relative h-64 bg-gradient-to-r from-primary-600 to-purple-600">
      {firstSlide.image && (
        <img src={firstSlide.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-6 text-center">
        {firstSlide.title && <h2 className="text-2xl font-bold mb-2">{firstSlide.title}</h2>}
        {firstSlide.subtitle && <p className="text-lg mb-2">{firstSlide.subtitle}</p>}
        {firstSlide.description && <p className="text-sm opacity-90 mb-4">{firstSlide.description}</p>}
        {firstSlide.buttonText && (
          <button className="bg-white text-primary-600 px-6 py-2 rounded-full font-bold text-sm">
            {firstSlide.buttonText}
          </button>
        )}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_: any, i: number) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
          ))}
        </div>
      )}
    </div>
  )
}

// Categories Preview
function CategoriesPreview({ section }: { section: any }) {
  const categories = section.content?.categories || []

  if (categories.length === 0) {
    return <div className="text-center text-gray-500 py-8">أضف فئات لرؤية المعاينة</div>
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
        {section.subtitle && <p className="text-xs text-gray-600">{section.subtitle}</p>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {categories.slice(0, 6).map((cat: any, i: number) => (
          <div key={i} className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="text-xs font-semibold text-gray-900">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Products Preview
function ProductsPreview({ section, products }: { section: any; products: any[] }) {
  const productIds = section.content?.productIds || []
  const selectedProducts = products.filter((p) => productIds.includes(p._id))

  if (selectedProducts.length === 0) {
    return <div className="text-center text-gray-500 py-8">اختر منتجات لرؤية المعاينة</div>
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
        {section.subtitle && <p className="text-xs text-gray-600">{section.subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {selectedProducts.slice(0, 4).map((product: any) => (
          <div key={product._id} className="bg-white rounded-lg p-2 border border-gray-200">
            {product.images?.[0] && (
              <img src={product.images[0]} alt="" className="w-full h-24 object-cover rounded mb-2" />
            )}
            <div className="text-xs font-bold text-gray-900 line-clamp-1">{product.nameAr || product.name}</div>
            <div className="text-xs text-primary-600 font-bold">{product.price?.toLocaleString()} ر.س</div>
          </div>
        ))}
      </div>
      {selectedProducts.length > 4 && (
        <div className="text-center mt-2 text-xs text-gray-500">+{selectedProducts.length - 4} منتج آخر</div>
      )}
    </div>
  )
}

// Banner Preview
function BannerPreview({ section }: { section: any }) {
  const { image, buttonText } = section.content || {}

  return (
    <div className="relative h-48 bg-gradient-to-r from-primary-600 to-purple-600">
      {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-xl font-bold mb-2">{section.title}</h2>
        {section.subtitle && <p className="text-sm mb-4">{section.subtitle}</p>}
        {buttonText && (
          <button className="bg-white text-primary-600 px-4 py-2 rounded-full font-bold text-xs">{buttonText}</button>
        )}
      </div>
    </div>
  )
}

// Text Preview
function TextPreview({ section }: { section: any }) {
  const { text } = section.content || {}

  return (
    <div className="p-6 text-center" dir="rtl">
      <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
      {section.subtitle && <p className="text-sm text-gray-600 mb-4">{section.subtitle}</p>}
      {text && <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>}
    </div>
  )
}

// Image Grid Preview
function ImageGridPreview({ section }: { section: any }) {
  const images = section.content?.images || []

  if (images.length === 0) {
    return <div className="text-center text-gray-500 py-8">أضف صور لرؤية المعاينة</div>
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
        {section.subtitle && <p className="text-xs text-gray-600">{section.subtitle}</p>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 3).map((img: any, i: number) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden">
            {img.image && <img src={img.image} alt="" className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
    </div>
  )
}
