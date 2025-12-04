export default function TechSpecs() {
  const features = [
    {
      icon: '⚡',
      title: 'أداء فائق',
      description: 'معالجات قوية لتجربة سلسة'
    },
    {
      icon: '📸',
      title: 'كاميرا احترافية',
      description: 'التقط أجمل اللحظات بدقة عالية'
    },
    {
      icon: '🔋',
      title: 'بطارية تدوم طويلاً',
      description: 'شحن سريع وعمر بطارية ممتد'
    },
    {
      icon: '🛡️',
      title: 'ضمان شامل',
      description: 'سنتان ضمان على جميع المنتجات'
    }
  ]

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">لماذا أبعاد التواصل؟</h2>
          <p className="text-sm md:text-base text-gray-600">تقنية متقدمة وجودة عالية</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
