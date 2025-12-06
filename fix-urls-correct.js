// 🔧 إصلاح صحيح لجميع hardcoded URLs
const fs = require('fs');

const replacements = [
  {
    file: 'frontend/src/app/terms/page.tsx',
    old: "fetch('http://localhost:4000/api/pages/terms')",
    new: "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pages/terms`)"
  },
  {
    file: 'frontend/src/app/privacy/page.tsx',
    old: "fetch('http://localhost:4000/api/pages/privacy')",
    new: "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pages/privacy`)"
  },
  {
    file: 'frontend/src/app/warranty/page.tsx',
    old: "fetch('http://localhost:4000/api/pages/warranty')",
    new: "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pages/warranty`)"
  },
  {
    file: 'frontend/src/app/return/page.tsx',
    old: "fetch('http://localhost:4000/api/pages/return')",
    new: "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pages/return`)"
  },
  {
    file: 'frontend/src/components/layout/Footer.tsx',
    old: "fetch('http://localhost:4000/api/settings/footer')",
    new: "fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/settings/footer`)"
  },
  {
    file: 'frontend/src/app/contact/page.tsx',
    old: "const res = await fetch('http://localhost:4000/api/contact',",
    new: "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'\n      const res = await fetch(`${API_URL}/contact`,"
  },
];

let totalFixed = 0;

replacements.forEach(({ file, old, new: newText }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes(old)) {
      content = content.replace(old, newText);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      totalFixed++;
    } else {
      console.log(`⏭️  Already fixed or not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${file} - ${error.message}`);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} files!`);
