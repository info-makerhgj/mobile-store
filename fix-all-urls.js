// 🔧 سكريبت لإصلاح جميع hardcoded URLs
const fs = require('fs');

const files = [
    "frontend/src/app/about/page.tsx",
    "frontend/src/app/admin/homepage-builder/page.tsx",
    "frontend/src/app/admin/settings/footer/page.tsx",
    "frontend/src/app/admin/settings/general/page.tsx",
    "frontend/src/app/admin/settings/shipping/page.tsx",
    "frontend/src/app/checkout/success/page.tsx",
    "frontend/src/app/checkout/page-complete.tsx",
    "frontend/src/app/checkout/page.tsx",
    "frontend/src/app/contact/page.tsx",
    "frontend/src/app/privacy/page.tsx",
    "frontend/src/app/return/page.tsx",
    "frontend/src/app/terms/page.tsx",
    "frontend/src/app/warranty/page.tsx",
    "frontend/src/components/layout/Footer.tsx",
    "frontend/src/components/AddressSelector.tsx",
    "frontend/src/components/ShippingSelector.tsx"
];

let totalFixed = 0;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        // استبدال localhost:4000/api
        content = content.replace(
            /['"]http:\/\/localhost:4000\/api['"]/g,
            "(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api')"
        );
        
        // استبدال localhost:4000 بدون /api
        content = content.replace(
            /['"]http:\/\/localhost:4000['"]/g,
            "(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000')"
        );
        
        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Fixed: ${file}`);
            totalFixed++;
        } else {
            console.log(`⏭️  Skipped: ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error: ${file} - ${error.message}`);
    }
});

console.log(`\n🎉 Fixed ${totalFixed} files!`);
console.log('\n📝 Next steps:');
console.log('1. git add .');
console.log('2. git commit -m "Fix: استبدال جميع hardcoded URLs"');
console.log('3. git push origin main');
