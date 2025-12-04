'use client'

import { Product } from '@/types'

const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    nameAr: 'آيفون 15 برو ماكس',
    nameEn: 'iPhone 15 Pro Max',
    price: 5499,
    originalPrice: 5999,
    brand: 'Apple',
    category: 'smartphones',
    images: ['/products/iphone15.jpg'],
    stock: 10,
    condition: 'new',
    rating: 4.8,
    reviewsCount: 124,
  } as Product,
]

export default function FeaturedProducts() {
  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-bold mb-8">المنتجات المميزة</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-xl p-4 hover:shadow-lg transition">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
            <h3 className="font-bold mb-2">{product.nameAr}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">{product.price} ر.س</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">{product.originalPrice}</span>
              )}
            </div>
            <button className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              أضف للسلة
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
