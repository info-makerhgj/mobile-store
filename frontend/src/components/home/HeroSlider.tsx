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
  title?: string
  subtitle?: string
  description?: string
  image: string
  mobileImage?: string // صورة منفصلة للجوال
  link: string
  buttonText?: string
  buttonStyle?: 'primary' | 'secondary'
}

interface HeroSliderProps {
  slides: Slide[]
  autoplay?: boolean
  interval?: number
}

export default function HeroSlider({ slides, autoplay = true, interval = 5000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

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

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  if (slides.length === 0) return null

  const getPrevIndex = () => (currentSlide - 1 + slides.length) % slides.length
  const getNextIndex = () => (currentSlide + 1) % slides.length

  return (
    <section className="relative w-full bg-gray-50 overflow-hidden py-4 md:py-6">
      {/* Mobile View - Swipeable */}
      <div className="block md:hidden">
        <div 
          className="relative mx-auto px-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Link href={slides[currentSlide].link} className="block relative group">
            <img
              src={slides[currentSlide].mobileImage || slides[currentSlide].image}
              alt={slides[currentSlide].title || 'Banner'}
              className="w-full h-auto object-cover rounded-lg"
            />
          </Link>
        </div>
      </div>

      {/* Desktop View with Side Peeks */}
      <div className="hidden md:block relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Main Slide */}
          <Link href={slides[currentSlide].link} className="block relative group z-10">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title || 'Banner'}
              className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02] shadow-xl"
            />
          </Link>

          {/* Side Peeks - 600px on each side */}
          {slides.length > 1 && (
            <>
              {/* Left Peek - 600px */}
              <div 
                className="absolute left-0 top-0 h-full cursor-pointer z-0"
                style={{ width: '600px', marginLeft: '-600px' }}
                onClick={prevSlide}
              >
                <img
                  src={slides[getPrevIndex()].image}
                  alt="Previous"
                  className="h-full w-full object-cover opacity-40 hover:opacity-60 transition-opacity"
                  style={{ objectPosition: 'right center' }}
                />
              </div>

              {/* Right Peek - 600px */}
              <div 
                className="absolute right-0 top-0 h-full cursor-pointer z-0"
                style={{ width: '600px', marginRight: '-600px' }}
                onClick={nextSlide}
              >
                <img
                  src={slides[getNextIndex()].image}
                  alt="Next"
                  className="h-full w-full object-cover opacity-40 hover:opacity-60 transition-opacity"
                  style={{ objectPosition: 'left center' }}
                />
              </div>
            </>
          )}

          {/* Navigation Arrows - Desktop */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all z-20 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all z-20 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-2 bg-primary-600'
                  : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
