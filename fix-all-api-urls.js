const fs = require('fs');
const path = require('path');

// استبدال localhost:4000 بـ localhost:5000 في جميع الملفات
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // استبدال localhost:4000 بـ localhost:5000
    content = content.replace(/localhost:4000/g, 'localhost:5000');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ تم تحديث: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ خطأ في: ${filePath}`, error.message);
    return false;
  }
}

// البحث في المجلد بشكل متكرر
function searchDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let updatedCount = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // تجاهل node_modules و .next
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        updatedCount += searchDirectory(filePath, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      if (replaceInFile(filePath)) {
        updatedCount++;
      }
    }
  }
  
  return updatedCount;
}

console.log('🔍 البحث عن localhost:4000 واستبداله بـ localhost:5000...\n');

const frontendCount = searchDirectory('./frontend/src');
const backendCount = searchDirectory('./backend/src');

console.log(`\n✅ تم تحديث ${frontendCount + backendCount} ملف`);
console.log(`   - Frontend: ${frontendCount} ملف`);
console.log(`   - Backend: ${backendCount} ملف`);
console.log('\n🎉 تم الانتهاء!');
