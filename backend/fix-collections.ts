import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

async function fixCollections() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 الاتصال بقاعدة البيانات...\n');
    await client.connect();
    const db = client.db();

    // نقل المنتجات من products إلى Product
    console.log('📦 نقل المنتجات...');
    const productsLower = await db.collection('products').find({}).toArray();
    
    if (productsLower.length > 0) {
      console.log(`   وجدت ${productsLower.length} منتج في collection "products"`);
      
      // حذف المنتجات القديمة من Product
      await db.collection('Product').deleteMany({});
      console.log('   ✅ تم مسح المنتجات القديمة من "Product"');
      
      // نقل المنتجات
      await db.collection('Product').insertMany(productsLower);
      console.log(`   ✅ تم نقل ${productsLower.length} منتج إلى "Product"`);
      
      // حذف collection القديم
      await db.collection('products').drop();
      console.log('   ✅ تم حذف collection "products" القديم');
    } else {
      console.log('   ℹ️  لا توجد منتجات في "products"');
    }

    // نقل الفئات من categories إلى Category
    console.log('\n📂 نقل الفئات...');
    const categoriesLower = await db.collection('categories').find({}).toArray();
    
    if (categoriesLower.length > 0) {
      console.log(`   وجدت ${categoriesLower.length} فئة في collection "categories"`);
      
      // حذف الفئات القديمة من Category
      await db.collection('Category').deleteMany({});
      console.log('   ✅ تم مسح الفئات القديمة من "Category"');
      
      // نقل الفئات
      await db.collection('Category').insertMany(categoriesLower);
      console.log(`   ✅ تم نقل ${categoriesLower.length} فئة إلى "Category"`);
      
      // حذف collection القديم
      await db.collection('categories').drop();
      console.log('   ✅ تم حذف collection "categories" القديم');
    } else {
      console.log('   ℹ️  لا توجد فئات في "categories"');
    }

    console.log('\n✅ تم إصلاح جميع الـ collections بنجاح!');
    
    // عرض الإحصائيات النهائية
    const finalProducts = await db.collection('Product').countDocuments();
    const finalCategories = await db.collection('Category').countDocuments();
    
    console.log('\n📊 الإحصائيات النهائية:');
    console.log(`   - المنتجات في "Product": ${finalProducts}`);
    console.log(`   - الفئات في "Category": ${finalCategories}`);

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

fixCollections();
