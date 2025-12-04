'use client'

import { useState, useEffect } from 'react'

export default function ProductSpecs({ productId }: { productId: string }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('ProductSpecs - Product data:', data)
          console.log('ProductSpecs - Specifications:', data.specifications)
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading || !product) {
    return null
  }

  // Convert specifications object to array format
  const specs = product.specifications ? Object.entries(product.specifications).map(([key, items]: [string, any]) => {
    const categoryNames: { [key: string]: string } = {
      screen: 'الشاشة',
      performance: 'المعالج والأداء',
      camera: 'الكاميرا',
      battery: 'البطارية والشحن',
      connectivity: 'الاتصال',
      design: 'التصميم',
    }
    return {
      category: categoryNames[key] || key,
      items: items || []
    }
  }) : []

  if (specs.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">المواصفات التقنية</h2>
          <p className="text-base md:text-xl text-gray-600">كل التفاصيل التي تحتاج معرفتها</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {specs.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-8">
              <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-primary-600">{section.category}</h3>
              <div className="space-y-3 md:space-y-4">
                {section.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center pb-3 md:pb-4 border-b border-gray-200 last:border-0 text-sm md:text-base">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
