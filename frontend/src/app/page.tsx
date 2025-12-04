'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import ProductSlider from '@/components/home/ProductSlider'
import DealsSection from '@/components/home/DealsSection'
import ExclusiveOffers from '@/components/home/ExclusiveOffers'

interface Section {
  id: string
  type: 'hero' | 'categories' | 'products' | 'banner' | 'text' | 'imageGrid'
  title: string
  subtitle?: string
  order: number
  active: boolean
  settings: any
  content: any
}

export default function HomeDynamic() {
  const [sections, setSections] = useState<Section[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageConfig()
    fetchProducts()
  }, [])

  const fetchHomepageConfig = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`)
      if (response.ok) {
        const data = await response.json()
        const activeSections = (data.sections || [])
          .filter((s: Section) => s.active)
          .sort((a: Section, b: Section) => a.order - b.order)
        setSections(activeSections)
      }
    } catch (error) {
      console.error('Error fetching homepage config:', error)
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        const productsList = Array.isArray(data) ? data : (data.products || [])
        setProducts(productsList)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} />
      case 'categories':
        return <CategoriesSection key={section.id} section={section} />
      case 'products':
        return <ProductsSection key={section.id} section={section} products={products} />
      case 'banner':
        return <BannerSection key={section.id} section={section} />
      case 'text':
        return <TextSection key={section.id} section={section} />
      case 'imageGrid':
        return <ImageGridSection key={section.id} section={section} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <main className="bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white">
      <Header />
      {sections.map((section) => renderSection(section))}
      <ExclusiveOffers />
      <DealsSection />
      {sections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">الصفحة قيد الإنشاء</h2>
            <p className="text-gray-600">لم يتم إضافة أي أقسام بعد</p>
          </div>
        </div>
      )}
      <Footer />
    </main>
  )
}

// Hero Section Component
function HeroSection({ section }: { section: Section }) {
  const slides = section.content.slides || []
  const formattedSlides = slides.map((slide: any, index: number) => ({
    id: `${section.id}-${index}`,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    image: slide.image,
    link: slide.buttonLink || '/products',
    buttonText: slide.buttonText || 'تسوق الآن',
    buttonStyle: 'primary' as const,
  }))

  return <HeroSlider slides={formattedSlides} autoplay={true} interval={5000} />
}

// Categories Section Component
function CategoriesSection({ section }: { section: Section }) {
  const categories = section.content.categories || []

  return (
    <section className="py-8 md:py-12 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{section.title}</h2>
          {section.subtitle && <p className="text-gray-600 text-xs md:text-sm">{section.subtitle}</p>}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {categories.map((category: any, index: number) => (
            <Link
              key={index}
              href={category.link || '/products'}
              className="group bg-white rounded-lg p-3 md:p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-primary-500"
            >
              <div className="text-3xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-[10px] md:text-xs">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Products Section Component
function ProductsSection({ section, products }: { section: Section; products: any[] }) {
  const productIds = section.content.productIds || []
  const selectedProducts = products.filter((p) => productIds.includes(p._id))

  if (selectedProducts.length === 0) return null

  return (
    <ProductSlider
      title={section.title}
      subtitle={section.subtitle || ''}
      products={selectedProducts}
    />
  )
}

// Banner Section Component
function BannerSection({ section }: { section: Section }) {
  const { image, buttonText, buttonLink } = section.content

  return (
    <section className="py-8 md:py-12 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={buttonLink || '/products'}
          className="block relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl overflow-hidden hover:shadow-xl transition-all"
        >
          {image && (
            <div className="absolute inset-0">
              <img src={image} alt={section.title} className="w-full h-full object-cover opacity-30" />
            </div>
          )}
          <div className="relative p-6 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">{section.title}</h2>
            {section.subtitle && (
              <p className="text-base md:text-lg mb-4 md:mb-6 text-white/90">{section.subtitle}</p>
            )}
            {buttonText && (
              <span className="inline-block bg-white text-primary-600 px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-gray-100 transition-all">
                {buttonText}
              </span>
            )}
          </div>
        </Link>
      </div>
    </section>
  )
}

// Text Section Component
function TextSection({ section }: { section: Section }) {
  const { text } = section.content

  return (
    <section className="py-8 md:py-12 bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">{section.title}</h2>
          {section.subtitle && <p className="text-gray-600 text-sm md:text-base mb-6">{section.subtitle}</p>}
          {text && (
            <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">{text}</div>
          )}
        </div>
      </div>
    </section>
  )
}

// Image Grid Section Component
function ImageGridSection({ section }: { section: Section }) {
  const images = section.content.images || []

  return (
    <section className="py-8 md:py-12 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{section.title}</h2>
          {section.subtitle && <p className="text-gray-600 text-xs md:text-sm">{section.subtitle}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img: any, index: number) => (
            <Link
              key={index}
              href={img.link || '/products'}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={img.image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
