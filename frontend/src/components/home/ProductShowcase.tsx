'use client'

import Link from 'next/link'
// Icons as simple SVG components
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface Product {
  id: string
  title: string
  subtitle: string
  description?: string
  image: string
  link: string
  price?: string
}

interface ProductShowcaseProps {
  title?: string
  subtitle?: string
  products: Product[]
  layout?: 'grid' | 'slider'
}

export default function ProductShowcase({ 
  title, 
  subtitle, 
  products,
  layout = 'grid' 
}: ProductShowcaseProps) {
  if (products.length === 0) return null

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-300"
            >
              {/* Image */}
              <Link href={product.link} className="block relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-sm text-primary-600 font-bold mb-2 uppercase tracking-wide">
                  {product.subtitle}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.price && (
                  <p className="text-2xl font-bold text-gray-900 mb-5">
                    {product.price}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={product.link}
                    className="flex-1 bg-primary-600 text-white py-3 px-5 rounded-full font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    اشتر الآن
                  </Link>
                  <Link
                    href={product.link}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-5 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
