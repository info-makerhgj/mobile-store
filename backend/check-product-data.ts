import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function checkProductData() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    // Get the HOTWAV product
    const product = await productsCollection.findOne({ brand: 'HOTWAV' })

    if (product) {
      console.log('\n📱 معلومات المنتج:')
      console.log('الاسم:', product.nameAr)
      console.log('السعر:', product.price)
      
      console.log('\n🎨 الألوان:')
      console.log(product.colors)
      
      console.log('\n💾 السعات:')
      console.log(product.storage)
      
      console.log('\n📸 الصور:')
      console.log('عدد الصور:', product.images?.length || 0)
      if (product.images) {
        product.images.forEach((img: string, i: number) => {
          const preview = img.length > 50 ? img.substring(0, 50) + '...' : img
          console.log(`  ${i + 1}. ${preview}`)
        })
      }
      
      console.log('\n⚡ الميزات السريعة:')
      console.log(product.quickFeatures)
      
      console.log('\n✨ الميزات الاستثنائية:')
      if (product.features) {
        product.features.forEach((f: any, i: number) => {
          console.log(`  ${i + 1}. ${f.title}`)
        })
      } else {
        console.log('  لا توجد ميزات')
      }
      
      console.log('\n📋 المواصفات التقنية:')
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => {
          console.log(`  ${key}:`, product.specifications[key].length, 'عنصر')
        })
      } else {
        console.log('  لا توجد مواصفات')
      }
      
      console.log('\n🔗 ID:', product._id)
    } else {
      console.log('❌ لم يتم العثور على منتج HOTWAV')
    }
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

checkProductData()
