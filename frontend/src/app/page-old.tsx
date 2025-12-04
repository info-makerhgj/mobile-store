'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import ProductShowcase from '@/components/home/ProductShowcase'

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
    { name: 'جوالات', icon: '📱', link: '/products?category=phones', count: '25+' },
    { name: 'تابلت', icon: '📲', link: '/products?category=tablets', count: '15+' },
    { name: 'سماعات', icon: '🎧', link: '/products?category=headphones', count: '30+' },
    { name: 'ساعات ذكية', icon: '⌚', link: '/products?category=watches', count: '20+' },
    { name: 'شواحن', icon: '🔌', link: '/products?category=chargers', count: '40+' },
    { name: 'حافظات', icon: '📦', link: '/products?category=cases', count: '50+' }
  ]

  const brands = [
    { name: 'Apple', logo: '🍎' },
    { name: 'Samsung', logo: '📱' },
    { name: 'Xiaomi', logo: '📲' },
    { name: 'Huawei', logo: '📱' },
    { name: 'Oppo', logo: '📲' },
    { name: 'Realme', logo: '📱' }
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

      {/* 2. Categories - تصميم نظيف */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              تسوق حسب الفئة
            </h2>
            <p className="text-gray-600">
              اختر ما يناسبك من منتجاتنا المتنوعة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-400"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <ProductShowcase
            title="أحدث المنتجات"
            subtitle="اكتشف أحدث الجوالات والتابلت لدينا"
            products={featuredProducts.map(p => ({
              id: p._id,
              title: p.nameAr,
              subtitle: p.brand,
              description: p.tagline,
              image: p.images?.[0] || 'https://via.placeholder.com/400',
              link: `/products/${p._id}`,
              price: `${p.price.toLocaleString()} ريال`
            }))}
          />
        </section>
      )}

      {/* 4. Banner - تصميم بسيط */}
      <section className="py-16 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl overflow-hidden p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              عروض الموسم
            </h2>
            <p className="text-xl mb-2">
              خصومات تصل إلى 40%
            </p>
            <p className="text-base mb-8 text-white/90">
              على جميع الجوالات والتابلت والإكسسوارات
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
              >
                تسوق الآن
              </Link>
              <Link
                href="/products"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary-600 transition-all"
              >
                اعرف المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <ProductShowcase
            title="الأكثر مبيعاً"
            subtitle="المنتجات الأكثر طلباً من عملائنا"
            products={bestSellers.map(p => ({
              id: p._id,
              title: p.nameAr,
              subtitle: p.brand,
              description: p.tagline,
              image: p.images?.[0] || 'https://via.placeholder.com/400',
              link: `/products/${p._id}`,
              price: `${p.price.toLocaleString()} ريال`
            }))}
          />
        </section>
      )}

      {/* 6. Promotional Images */}
      <section className="py-16 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              عروض حصرية
            </h2>
            <p className="text-gray-600">
              اكتشف أفضل العروض والمنتجات
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promoImages.map((promo, index) => (
              <Link
                key={index}
                href={promo.link}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block bg-primary-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      {promo.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">
                      {promo.title}
                    </h3>
                    <span className="text-sm font-semibold">تسوق الآن ←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Brands - تصميم نظيف مثل الصورة */}
      <section className="py-16 bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              العلامات التجارية
            </h2>
            <p className="text-gray-600">
              نوفر أفضل العلامات التجارية العالمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={`/products?brand=${brand.name}`}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Features */}
      <section className="py-16 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl mb-3">🚚</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">شحن مجاني</h3>
              <p className="text-sm text-gray-600">على جميع الطلبات فوق 500 ريال</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">دفع آمن</h3>
              <p className="text-sm text-gray-600">جميع طرق الدفع محمية ومؤمنة</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-3">↩️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">إرجاع مجاني</h3>
              <p className="text-sm text-gray-600">خلال 14 يوم من تاريخ الشراء</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-3">💬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">دعم فني</h3>
              <p className="text-sm text-gray-600">فريق دعم متاح على مدار الساعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA - تصميم بسيط مثل الصورة */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            جاهز للترقية؟
          </h2>
          <p className="text-lg mb-8">
            احصل على أحدث الأجهزة مع عروض حصرية وشحن مجاني
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
            >
              تسوق الآن
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary-600 transition-all"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
