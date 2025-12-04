'use client'

import HeroSlider from '@/components/home/HeroSlider'
import ProductShowcase from '@/components/home/ProductShowcase'

export default function PreviewHomepage() {
  // Sample Hero Slider Data
  const heroSlides = [
    {
      id: '1',
      title: 'iPhone 17 Pro',
      subtitle: 'كله علي بعضه Pro',
      description: 'أقوى أداء. أفضل كاميرا. تصميم تيتانيوم.',
      image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b8?w=1200',
      link: '/products/iphone-17',
      buttonText: 'اشتر الآن',
      buttonStyle: 'primary' as const
    },
    {
      id: '2',
      title: 'iPhone Air',
      subtitle: 'أنحف iPhone علي الإطلاق',
      description: 'في قلبه قوة عملاق.',
      image: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=1200',
      link: '/products/iphone-air',
      buttonText: 'اعرف المزيد',
      buttonStyle: 'secondary' as const
    },
    {
      id: '3',
      title: 'Apple Watch Series 10',
      subtitle: 'صحتك في متناول يدك',
      description: 'مراقبة صحية متقدمة. تصميم أنيق.',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200',
      link: '/products/apple-watch',
      buttonText: 'تسوق الآن',
      buttonStyle: 'primary' as const
    }
  ]

  // Sample Products Data
  const products = [
    {
      id: '1',
      title: 'iPhone 17 Pro Max',
      subtitle: 'شاشة 6.9 بوصة',
      description: 'معالج A19 Pro. كاميرا 108MP.',
      image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b8?w=600',
      link: '/products/iphone-17-pro-max',
      price: '5,999 ريال'
    },
    {
      id: '2',
      title: 'iPhone 17 Pro',
      subtitle: 'شاشة 6.3 بوصة',
      description: 'معالج A19 Pro. كاميرا 64MP.',
      image: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600',
      link: '/products/iphone-17-pro',
      price: '4,999 ريال'
    },
    {
      id: '3',
      title: 'iPhone 17',
      subtitle: 'شاشة 6.1 بوصة',
      description: 'معالج A18. كاميرا 48MP.',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600',
      link: '/products/iphone-17',
      price: '3,999 ريال'
    }
  ]

  const accessories = [
    {
      id: '4',
      title: 'AirPods Pro 3',
      subtitle: 'إلغاء ضوضاء نشط',
      description: 'صوت مكاني. شحن لاسلكي.',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600',
      link: '/products/airpods-pro-3',
      price: '999 ريال'
    },
    {
      id: '5',
      title: 'Apple Watch Ultra 3',
      subtitle: 'للمغامرات القاسية',
      description: 'تيتانيوم. GPS دقيق. مقاوم للماء.',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600',
      link: '/products/apple-watch-ultra-3',
      price: '3,499 ريال'
    },
    {
      id: '6',
      title: 'iPad Pro M4',
      subtitle: 'شاشة OLED 13 بوصة',
      description: 'معالج M4. قلم Apple Pencil Pro.',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
      link: '/products/ipad-pro-m4',
      price: '4,999 ريال'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} autoplay={true} interval={5000} />

      {/* Products Showcase */}
      <ProductShowcase
        title="أحدث المنتجات"
        subtitle="اكتشف أحدث إصداراتنا من iPhone"
        products={products}
      />

      {/* Accessories Showcase */}
      <ProductShowcase
        title="الإكسسوارات"
        subtitle="أكمل تجربتك مع أفضل الإكسسوارات"
        products={accessories}
      />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            جاهز للترقية؟
          </h2>
          <p className="text-xl mb-8 text-white/90">
            احصل على أحدث الأجهزة مع عروض حصرية وشحن مجاني
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
              تسوق الآن
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition">
              تواصل معنا
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
