import Link from 'next/link'

export default function RelatedProducts({ productId }: { productId: string }) {
  const products = [
    { id: '2', name: 'أبعاد X لايت', price: 1799, image: '📱' },
    { id: '3', name: 'أبعاد واتش إيليت', price: 899, image: '⌚' },
    { id: '4', name: 'أبعاد بودز برو', price: 499, image: '🎧' },
    { id: '5', name: 'أبعاد تاب برو', price: 2299, image: '📲' },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">منتجات ذات صلة</h2>
          <p className="text-base md:text-xl text-gray-600">قد تعجبك أيضاً</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl transition group"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <span className="text-5xl md:text-6xl">{product.image}</span>
              </div>
              <h3 className="font-bold text-sm md:text-base mb-2">{product.name}</h3>
              <p className="text-primary-600 font-bold text-base md:text-lg">{product.price.toLocaleString()} ر.س</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
