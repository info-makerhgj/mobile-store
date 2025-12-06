// 🔧 سكريبت لإصلاح جميع الـ hardcoded URLs
const fs = require('fs');
const path = require('path');

const files = [
  'frontend/src/components/ShippingSelector.tsx',
  'frontend/src/components/layout/Footer.tsx',
  'frontend/src/components/AddressSelector.tsx',
  'frontend/src/app/warranty/page.tsx',
  'frontend/src/app/terms/page.tsx',
  'frontend/src/app/return/page.tsx',
  'frontend/src/app/privacy/page.tsx',
  'frontend/src/app/contact/page.tsx',
  'frontend/src/app/admin/homepage-builder/page.tsx',
  'frontend/src/app/admin/settings/shipping/page.tsx',
  'frontend/src/app/admin/settings/general/page.tsx',
  'frontend/src/app/admin/settings/footer/page.tsx',
  'frontend/src/app/checkout/success/page.tsx',
  'frontend/src/app/checkout/page.tsx',
  'frontend/src/app/checkout/page-complete.tsx',
  'frontend/src/app/admin/customers/page.tsx',
  'frontend/src/app/about/page.tsx',
];

const API_URL_CONST = "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'";

let totalFixed = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // استبدال جميع localhost:4000
    content = content.replace(/http:\/\/localhost:4000\/api/g, '${API_URL}');
    content = content.replace(/http:\/\/localhost:4000/g, '${API_URL}');
    content = content.replace(/'http:\/\/localhost:4000\/api'/g, 'API_URL');
    
    // إضافة const API_URL في بداية الدالة إذا لم يكن موجود
    if (content.includes('${API_URL}') && !content.includes('const API_URL')) {
      // البحث عن أول دالة async
      const asyncMatch = content.match(/(const \w+ = async \(\) => \{|async function \w+\(\) \{)/);
      if (asyncMatch) {
        const insertPos = asyncMatch.index + asyncMatch[0].length;
        content = content.slice(0, insertPos) + '\n    ' + API_URL_CONST + content.slice(insertPos);
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      totalFixed++;
    } else {
      console.log(`⏭️  Skipped: ${filePath} (no changes needed)`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} files!`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes: git diff');
console.log('2. Test locally: npm run dev');
console.log('3. Commit: git add . && git commit -m "Fix: استبدال hardcoded URLs"');
console.log('4. Push: git push origin main');
