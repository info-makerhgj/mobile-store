'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'Abaad X Pro',
    subtitle: 'قوة الأداء. جمال التصميم.',
    description: 'معالج ثماني النواة | كاميرا 108MP | شاشة AMOLED 6.8 بوصة',
    price: 'ابتداءً من 2,999 ريال',
    bg: 'from-primary-900 to-primary-700',
    textColor: 'text-white',
  },
  {
    id: 2,
    title: 'Abaad Watch Elite',
    subtitle: 'صحتك في متناول يدك',
    description: 'مراقبة صحية متقدمة | عمر بطارية 7 أيام | مقاومة للماء',
    price: 'ابتداءً من 899 ريال',
    bg: 'from-indigo-900 to-indigo-700',
    textColor: 'text-white',
  },
  {
    id: 3,
    title: 'عروض خاصة',
    subtitle: 'خصومات تصل إلى 30%',
    description: 'على مجموعة مختارة من منتجات أبعاد التواصل',
    price: 'لفترة محدودة',
    bg: 'from-violet-900 to-purple-700',
    textColor: 'text-white',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full bg-gradient-to-br ${slide.bg} ${slide.textColor}`}>
            <div className="container-custom h-full flex items-center">
              <div className="max-w-2xl space-y-3 md:space-y-4 lg:space-y-6 px-4 md:px-0">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm">
                  جديد
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light opacity-90">
                  {slide.subtitle}
                </p>
                <p className="text-sm md:text-base lg:text-lg opacity-80">
                  {slide.description}
                </p>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {slide.price}
                </div>
                <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                  <Link 
                    href="/products"
                    className="bg-white text-gray-900 px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-sm md:text-base font-bold hover:bg-gray-100 transition-all hover:scale-105"
                  >
                    اشتري الآن
                  </Link>
                  <Link 
                    href="/products"
                    className="border-2 border-white px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-sm md:text-base font-bold hover:bg-white hover:text-gray-900 transition-all"
                  >
                    اعرف المزيد
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
