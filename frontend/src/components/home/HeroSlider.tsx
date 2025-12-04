'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Icons as simple SVG components
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface Slide {
  id: string
  title: string
  subtitle: string
  description?: string
  image: string
  link: string
  buttonText: string
  buttonStyle?: 'primary' | 'secondary'
}

interface HeroSliderProps {
  slides: Slide[]
  autoplay?: boolean
  interval?: number
}

export default function HeroSlider({ slides, autoplay = true, interval = 5000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) return null

  const slide = slides[currentSlide]

  return (
    <section className="relative w-full bg-gray-900 overflow-hidden">
      {/* Slide Content */}
      <div className="relative h-[400px] md:h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-end h-full pb-12 md:pb-20 text-center" dir="rtl">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-5 animate-fade-in leading-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl text-white mb-2 md:mb-3 animate-fade-in-delay font-semibold">
                {slide.subtitle}
              </p>
              {slide.description && (
                <p className="text-sm md:text-lg text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto">
                  {slide.description}
                </p>
              )}
              
              {/* Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href={slide.link}
                  className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-xl ${
                    slide.buttonStyle === 'secondary'
                      ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {slide.buttonText}
                </Link>
                <Link
                  href={slide.link}
                  className="px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
                >
                  اعرف المزيد
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
