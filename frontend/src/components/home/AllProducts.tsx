'use client'

import Link from 'next/link'

const allProducts = [
  { id: '1', name: 'Abaad X Pro', nameAr: 'أبعاد X برو', price: 2999, originalPrice: 3499, category: 'smartphones', icon: '📱' },
  { id: '2', name: 'Abaad X Lite', nameAr: 'أبعاد X لايت', price: 1799, originalPrice: 2199, category: 'smartphones', icon: '📱' },
  { id: '3', name: 'Abaad X Max', nameAr: 'أبعاد X ماكس', price: 3499, originalPrice: 3999, category: 'smartphones', icon: '📱' },
  { id: '4', name: 'Abaad X Mini', nameAr: 'أبعاد X ميني', price: 1299, category: 'smartphones', icon: '📱' },
  { id: '5', name: 'Abaad Tab Pro', nameAr: 'أبعاد تاب برو', price: 2299, originalPrice: 2799, category: 'tablets', icon: '📲' },
  { id: '6', name: 'Abaad Tab Lite', nameAr: 'أبعاد تاب لايت', price: 1499, category: 'tablets', icon: '📲' },
  { id: '7', name: 'Abaad Watch Elite', nameAr: 'أبعاد واتش إيليت', price: 899, originalPrice: 1099, category: 'smartwatches', icon: '⌚' },
  { id: '8', name: 'Abaad Watch Sport', nameAr: 'أبعاد واتش سبورت', price: 599, category: 'smartwatches', icon: '⌚' },
  { id: '9', name: 'Abaad Watch Classic', nameAr: 'أبعاد واتش كلاسيك', price: 799, category: 'smartwatches', icon: '⌚' },
  { id: '10', name: 'Abaad Buds Pro', nameAr: 'أبعاد بودز برو', price: 499, originalPrice: 599, category: 'headphones', icon: '🎧' },
  { id: '11', name: 'Abaad Buds Lite', nameAr: 'أبعاد بودز لايت', price: 299, category: 'headphones', icon: '🎧' },
  { id: '12', name: 'Abaad Buds Max', nameAr: 'أبعاد بودز ماكس', price: 699, category: 'headphones', icon: '🎧' },
]

export default function AllProducts() {
  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">جميع منتجاتنا</h2>
          <p className="text-sm md:text-base text-gray-600">12 منتج من أبعاد التواصل</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {allProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-purple-50 p-4 md:p-6 lg:p-8">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  {product.icon}
                </div>
              </div>

              <div className="p-3 md:p-4">
                <h3 className="font-bold text-xs md:text-sm lg:text-base mb-1 md:mb-2 group-hover:text-primary-600 transition line-clamp-2">
                  {product.nameAr}
                </h3>
                <div className="text-sm md:text-base lg:text-xl font-bold text-primary-600">
                  {product.price.toLocaleString()} ر.س
                </div>

                {/* Payment Options - Tabby & Tamara */}
                <div style={{ 
                  width: '100%',
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    fontSize: '8px',
                    color: '#9ca3af'
                  }}>
                    <span>قسّمها على</span>
                    <span style={{
                      backgroundColor: '#3EDDB4',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                      fontSize: '7px'
                    }}>tabby</span>
                    <span style={{
                      backgroundColor: '#000',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                      fontSize: '7px'
                    }}>tamara</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
