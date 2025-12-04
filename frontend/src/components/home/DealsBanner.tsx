'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DealsBanner() {
  const [currentDeal, setCurrentDeal] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const deals = [
    {
      icon: '🔥',
      text: 'خصومات تصل إلى 50% على الجوالات',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '⚡',
      text: 'شحن مجاني لجميع الطلبات',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: '🎁',
      text: 'هدية مجانية مع كل طلب',
      color: 'from-green-500 to-teal-500'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % deals.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`bg-gradient-to-r ${deals[currentDeal].color} text-white relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container-mobile relative z-10">
        <div className="flex items-center justify-between py-2 md:py-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl md:text-2xl animate-bounce">
              {deals[currentDeal].icon}
            </span>
            <p className="text-xs md:text-sm font-bold animate-fadeIn">
              {deals[currentDeal].text}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/deals">
              <button className="btn btn-sm bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 text-xs">
                تسوق الآن
              </button>
            </Link>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="إغلاق"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
        <div 
          className="h-full bg-white transition-all duration-[4000ms] ease-linear"
          style={{ width: '100%' }}
          key={currentDeal}
        ></div>
      </div>
    </div>
  )
}
