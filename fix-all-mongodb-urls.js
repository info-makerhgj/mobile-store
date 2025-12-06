// 🔧 إصلاح جميع MongoDB URLs في المشروع
const fs = require('fs');
const path = require('path');

const files = [
  'backend/src/utils/calculations.ts',
  'backend/src/services/ShippingService.ts',
  'backend/src/services/PaymentService.ts',
  'backend/src/services/OrderService.ts',
  'backend/src/controllers/pagesController.ts',
  'backend/src/controllers/paymentController.ts',
  'backend/src/controllers/settingsController.ts',
  'backend/src/controllers/addressController.ts',
  'backend/src/controllers/categoryController.ts',
];

const oldPatterns = [
  /const mongoUrl = process\.env\.DATABASE_URL \|\| 'mongodb:\/\/localhost:27017\/abaad_store'/g,
  /const mongoUrl = process\.env\.DATABASE_URL \|\| 'mongodb:\/\/localhost:27017\/mobile_store'/g,
  /const mongoUrl = process\.env\.DATABASE_URL \|\| 'mongodb:\/\/localhost:27017\/mobile-store'/g,
  /const MONGODB_URI = process\.env\.MONGODB_URI \|\| 'mongodb:\/\/localhost:27017\/mobile-store'/g,
  /const MONGODB_URI = process\.env\.MONGODB_URI \|\| 'mongodb:\/\/localhost:27017\/mobile_store'/g,
];

const newImport = "import { MONGODB_URI } from '../config/database';";
const newDeclaration = "const mongoUrl = MONGODB_URI;";

let totalFixed = 0;

files.forEach(file => {
  try {
    if (!fs.existsSync(file)) {
      console.log(`⏭️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // إضافة import إذا لم يكن موجود
    if (!content.includes("import { MONGODB_URI }")) {
      // البحث عن آخر import
      const lastImportMatch = content.match(/import .* from .*\n/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        content = content.slice(0, lastImportIndex + lastImport.length) + 
                  newImport + '\n' + 
                  content.slice(lastImportIndex + lastImport.length);
      }
    }
    
    // استبدال جميع الأنماط القديمة
    oldPatterns.forEach(pattern => {
      content = content.replace(pattern, newDeclaration);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      totalFixed++;
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${file} - ${error.message}`);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} files!`);
console.log('\n📝 Next steps:');
console.log('1. cd backend');
console.log('2. npm run build');
console.log('3. pm2 restart mobile-store-api');
