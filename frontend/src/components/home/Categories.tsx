import Link from 'next/link'

const categories = [
  { 
    name: 'الجوالات الذكية', 
    slug: 'smartphones', 
    bg: 'bg-gradient-to-br from-primary-600 to-primary-800',
    icon: '📱',
    description: 'أحدث الإصدارات'
  },
  { 
    name: 'الأجهزة اللوحية', 
    slug: 'tablets', 
    bg: 'bg-gradient-to-br from-purple-600 to-purple-800',
    icon: '📲',
    description: 'للعمل والترفيه'
  },
  { 
    name: 'الساعات الذكية', 
    slug: 'smartwatches', 
    bg: 'bg-gradient-to-br from-indigo-600 to-indigo-800',
    icon: '⌚',
    description: 'تقنية متقدمة'
  },
  { 
    name: 'السماعات', 
    slug: 'headphones', 
    bg: 'bg-gradient-to-br from-violet-600 to-violet-800',
    icon: '🎧',
    description: 'صوت نقي'
  },
]

export default function Categories() {
  return (
    <section className="py-8 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">تسوق حسب الفئة</h2>
          <p className="text-sm md:text-base text-gray-600">اكتشف مجموعتنا المتنوعة من المنتجات</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className={`${category.bg} text-white rounded-2xl md:rounded-3xl p-6 md:p-8 text-center hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl group relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">{category.name}</h3>
                <p className="text-xs md:text-sm opacity-90">{category.description}</p>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
