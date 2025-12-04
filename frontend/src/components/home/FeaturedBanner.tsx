import Link from 'next/link'

export default function FeaturedBanner() {
  return (
    <section className="py-6 md:py-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Banner 1 */}
          <Link href="/products?category=smartwatches" className="group relative overflow-hidden rounded-2xl md:rounded-3xl h-60 md:h-80 bg-gradient-to-br from-indigo-600 to-indigo-800">
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between text-white">
              <div>
                <div className="text-xs md:text-sm font-medium mb-1 md:mb-2">ساعات ذكية</div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">Abaad Watch</h3>
                <p className="text-sm md:text-base lg:text-lg opacity-90">تتبع صحتك ولياقتك بذكاء</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm md:text-base lg:text-lg font-bold group-hover:gap-4 transition-all">
                تسوق الآن
                <span>←</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-7xl md:text-8xl lg:text-9xl opacity-20 group-hover:scale-110 transition-transform">
              ⌚
            </div>
          </Link>

          {/* Banner 2 */}
          <Link href="/products?category=headphones" className="group relative overflow-hidden rounded-2xl md:rounded-3xl h-60 md:h-80 bg-gradient-to-br from-violet-600 to-purple-800">
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between text-white">
              <div>
                <div className="text-xs md:text-sm font-medium mb-1 md:mb-2">سماعات لاسلكية</div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">Abaad Buds</h3>
                <p className="text-sm md:text-base lg:text-lg opacity-90">صوت نقي وإلغاء ضوضاء متقدم</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm md:text-base lg:text-lg font-bold group-hover:gap-4 transition-all">
                اكتشف المزيد
                <span>←</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-7xl md:text-8xl lg:text-9xl opacity-20 group-hover:scale-110 transition-transform">
              🎧
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
