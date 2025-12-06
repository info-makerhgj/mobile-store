const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// الاتصال بقاعدة البيانات
const DB_URL = 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster&tls=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true';

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

// Shipping Company Schema
const ShippingCompanySchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  isActive: { type: Boolean, default: true },
  cities: [{
    cityName: String,
    cityNameAr: String,
    price: Number,
    isActive: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const ShippingCompany = mongoose.model('ShippingCompany', ShippingCompanySchema);

async function setup() {
  try {
    console.log('🔄 جاري الاتصال بقاعدة البيانات...');
    await mongoose.connect(DB_URL);
    console.log('✅ تم الاتصال بقاعدة البيانات\n');

    // 1. إنشاء حساب Admin
    console.log('🔄 جاري إنشاء حساب Admin...');
    const existingAdmin = await User.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('⚠️  حساب Admin موجود مسبقاً - سيتم تحديث كلمة المرور');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ تم تحديث كلمة المرور بنجاح!');
      console.log('   📧 Email: admin@ab-tw.com');
      console.log('   🔑 Password: Admin@123\n');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new User({
        name: 'مدير النظام',
        email: 'admin@ab-tw.com',
        password: hashedPassword,
        role: 'admin',
        phone: '0500000000'
      });
      await admin.save();
      console.log('✅ تم إنشاء حساب Admin بنجاح!');
      console.log('   📧 Email: admin@ab-tw.com');
      console.log('   🔑 Password: Admin@123\n');
    }

    // 2. إنشاء شركات الشحن
    console.log('🔄 جاري إنشاء شركات الشحن...');
    
    const shippingCompanies = [
      {
        name: 'SMSA Express',
        nameAr: 'سمسا إكسبريس',
        cities: [
          { cityName: 'Riyadh', cityNameAr: 'الرياض', price: 25, isActive: true },
          { cityName: 'Jeddah', cityNameAr: 'جدة', price: 30, isActive: true },
          { cityName: 'Dammam', cityNameAr: 'الدمام', price: 30, isActive: true },
          { cityName: 'Mecca', cityNameAr: 'مكة', price: 30, isActive: true },
          { cityName: 'Medina', cityNameAr: 'المدينة', price: 35, isActive: true }
        ]
      },
      {
        name: 'Aramex',
        nameAr: 'أرامكس',
        cities: [
          { cityName: 'Riyadh', cityNameAr: 'الرياض', price: 28, isActive: true },
          { cityName: 'Jeddah', cityNameAr: 'جدة', price: 32, isActive: true },
          { cityName: 'Dammam', cityNameAr: 'الدمام', price: 32, isActive: true },
          { cityName: 'Mecca', cityNameAr: 'مكة', price: 32, isActive: true },
          { cityName: 'Medina', cityNameAr: 'المدينة', price: 38, isActive: true }
        ]
      },
      {
        name: 'Zajil Express',
        nameAr: 'زاجل إكسبريس',
        cities: [
          { cityName: 'Riyadh', cityNameAr: 'الرياض', price: 22, isActive: true },
          { cityName: 'Jeddah', cityNameAr: 'جدة', price: 28, isActive: true },
          { cityName: 'Dammam', cityNameAr: 'الدمام', price: 28, isActive: true },
          { cityName: 'Mecca', cityNameAr: 'مكة', price: 28, isActive: true },
          { cityName: 'Medina', cityNameAr: 'المدينة', price: 32, isActive: true }
        ]
      }
    ];

    for (const company of shippingCompanies) {
      const existing = await ShippingCompany.findOne({ name: company.name });
      if (existing) {
        console.log(`⚠️  ${company.nameAr} موجودة مسبقاً`);
      } else {
        await ShippingCompany.create(company);
        console.log(`✅ تم إنشاء شركة ${company.nameAr}`);
      }
    }

    console.log('\n✅ تم الإعداد بنجاح!');
    console.log('\n📋 معلومات تسجيل الدخول:');
    console.log('   🌐 الرابط: https://your-frontend.vercel.app/admin/login');
    console.log('   📧 Email: admin@ab-tw.com');
    console.log('   🔑 Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

setup();
