'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import ProductSlider from '@/components/home/ProductSlider'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [bestSellers, setBestSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        const products = Array.isArray(data) ? data : []
        
        setFeaturedProducts(products.slice(0, 6))
        setBestSellers(products.slice(6, 12))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const heroSlides = [
    {
      id: '1',
      title: 'أحدث الجوالات الذكية',
      subtitle: 'تكنولوجيا متقدمة بين يديك',
      description: 'اكتشف أقوى الأجهزة مع أداء استثنائي وتصميم عصري',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80',
      link: '/products',
      buttonText: 'تسوق الآن',
      buttonStyle: 'primary' as const
    },
    {
      id: '2',
      title: 'عروض حصرية',
      subtitle: 'خصومات تصل إلى 40%',
      description: 'على مجموعة مختارة من الجوالات والتابلت',
      image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b8?w=1920&q=80',
      link: '/products',
      buttonText: 'اكتشف العروض',
      buttonStyle: 'secondary' as const
    },
    {
      id: '3',
      title: 'تابلت بأداء قوي',
      subtitle: 'للعمل والترفيه',
      description: 'شاشات كبيرة وأداء سريع لتجربة استثنائية',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1920&q=80',
      link: '/products?category=tablets',
      buttonText: 'تسوق التابلت',
      buttonStyle: 'primary' as const
    },
    {
      id: '4',
      title: 'إكسسوارات أصلية',
      subtitle: 'أكمل تجربتك',
      description: 'شواحن سريعة، سماعات، وحافظات عالية الجودة',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&q=80',
      link: '/products?category=accessories',
      buttonText: 'تسوق الإكسسوارات',
      buttonStyle: 'primary' as const
    }
  ]

  const categories = [
    { name: 'جوالات', icon: '📱', link: '/products?category=phones' },
    { name: 'تابلت', icon: '📲', link: '/products?category=tablets' },
    { name: 'سماعات', icon: '🎧', link: '/products?category=headphones' },
    { name: 'ساعات ذكية', icon: '⌚', link: '/products?category=watches' },
    { name: 'شواحن', icon: '🔌', link: '/products?category=chargers' },
    { name: 'حافظات', icon: '📦', link: '/products?category=cases' }
  ]

  const promoImages = [
    {
      title: 'جوالات بأسعار مميزة',
      subtitle: 'خصم 30%',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      link: '/products?category=phones'
    },
    {
      title: 'تابلت للعمل والترفيه',
      subtitle: 'عروض خاصة',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      link: '/products?category=tablets'
    },
    {
      title: 'إكسسوارات أصلية',
      subtitle: 'جودة عالية',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
      link: '/products?category=accessories'
    }
  ]

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
      
      {/* 1. Hero Slider */}
      <HeroSlider slides={heroSlides} autoplay={true} interval={5000} />

      {/* 2. Categories */}
      <section className="py-8 md:py-12 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8 text-center">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
              تسوق حسب الفئة
            </h2>
            <p className="text-gray-600 text-xs md:text-sm">
              اختر ما يناسبك من منتجاتنا المتنوعة
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group bg-white rounded-lg p-3 md:p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-primary-500"
              >
                <div className="text-3xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-[10px] md:text-xs">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products - Slider */}
      {featuredProducts.length > 0 && (
        <ProductSlider
          title="أحدث المنتجات"
          subtitle="اكتشف أحدث الجوالات والتابلت لدينا"
          products={featuredProducts}
        />
      )}

      {/* 4. Banner */}
      <section className="py-8 md:py-12 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl overflow-hidden p-6 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
              عروض الموسم
            </h2>
            <p className="text-base md:text-lg mb-1">
              خصومات تصل إلى 40%
            </p>
            <p className="text-xs md:text-sm mb-4 md:mb-6 text-white/90">
              على جميع الجوالات والتابلت والإكسسوارات
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-primary-600 px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-gray-100 transition-all"
            >
              تسوق الآن
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers - Slider */}
      {bestSellers.length > 0 && (
        <ProductSlider
          title="الأكثر مبيعاً"
          subtitle="المنتجات الأكثر طلباً من عملائنا"
          products={bestSellers}
        />
      )}

      {/* 6. Promotional Images */}
      <section className="py-8 md:py-12 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8 text-center">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
              عروض حصرية
            </h2>
            <p className="text-gray-600 text-xs md:text-sm">
              اكتشف أفضل العروض والمنتجات
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {promoImages.map((promo, index) => (
              <Link
                key={index}
                href={promo.link}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                    <span className="inline-block bg-primary-600 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold mb-1 md:mb-2">
                      {promo.subtitle}
                    </span>
                    <h3 className="text-base md:text-xl font-bold mb-1">
                      {promo.title}
                    </h3>
                    <span className="text-[10px] md:text-xs font-semibold group-hover:translate-x-1 inline-block transition-transform">
                      تسوق الآن ←
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
