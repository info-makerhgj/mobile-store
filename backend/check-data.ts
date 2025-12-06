import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

async function checkData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 الاتصال بقاعدة البيانات...\n');
    await client.connect();
    const db = client.db();

    // فحص الفئات
    console.log('📂 الفئات:');
    const categories = await db.collection('categories').find({}).toArray();
    console.log(`   عدد الفئات: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log('\n📦 المنتجات:');
    const products = await db.collection('products').find({}).toArray();
    console.log(`   عدد المنتجات: ${products.length}`);
    products.forEach(product => {
      console.log(`   - ${product.name} - ${product.price} ريال (المخزون: ${product.stock})`);
    });

    console.log('\n📄 الصفحات:');
    const pages = await db.collection('Pages').find({}).toArray();
    console.log(`   عدد الصفحات: ${pages.length}`);
    pages.forEach(page => {
      console.log(`   - ${page.title} (${page.slug})`);
    });

    console.log('\n👥 المستخدمين:');
    const users = await db.collection('users').find({}).toArray();
    console.log(`   عدد المستخدمين: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    if (products.length === 0) {
      console.log('\n⚠️  لا توجد منتجات! قم بتشغيل:');
      console.log('   npm run add:demo');
    }

    if (categories.length === 0) {
      console.log('\n⚠️  لا توجد فئات! قم بتشغيل:');
      console.log('   npm run add:demo');
    }

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

checkData();
