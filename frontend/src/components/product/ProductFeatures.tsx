'use client'

import { useState, useEffect } from 'react'

export default function ProductFeatures({ productId }: { productId: string }) {
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('ProductFeatures - Product data:', data)
          console.log('ProductFeatures - Features:', data.features)
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [productId])

  // Default features if not in database
  const defaultFeatures = [
    {
      title: 'شاشة AMOLED الرائعة',
      description: 'استمتع بألوان نابضة بالحياة ووضوح استثنائي مع شاشة 6.8 بوصة بدقة 2K+ ومعدل تحديث 120Hz',
      image: '🖥️',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'أداء فائق السرعة',
      description: 'معالج ثماني النواة بتقنية 5nm يوفر أداءً سلساً وسرعة استجابة فورية في جميع التطبيقات',
      image: '⚡',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'كاميرا احترافية',
      description: 'التقط صوراً مذهلة بدقة 108MP مع تثبيت بصري وتصوير فيديو 8K',
      image: '📸',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'بطارية تدوم طويلاً',
      description: 'بطارية 5000mAh مع شحن سريع 65W - من 0 إلى 100% في 35 دقيقة فقط',
      image: '🔋',
      gradient: 'from-green-500 to-emerald-500',
    },
  ]

  const features = product?.features || defaultFeatures

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">مميزات استثنائية</h2>
          <p className="text-base md:text-xl text-gray-600">تقنية متقدمة في كل التفاصيل</p>
        </div>

        <div className="space-y-16 md:space-y-32">
          {features.map((feature: any, index: number) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className={`relative aspect-square rounded-2xl md:rounded-3xl bg-gradient-to-br ${feature.gradient} p-8 md:p-12 flex items-center justify-center overflow-hidden`}>
                  {feature.image?.startsWith('data:image') || feature.image?.startsWith('http') ? (
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-6xl md:text-8xl lg:text-9xl">{feature.image}</div>
                  )}
                </div>
              </div>

              {/* Text Side */}
              <div className={`text-right ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-6">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
