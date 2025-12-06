# 🚀 دليل الرفع السريع

## ⚡ الخطوات السريعة

### 1️⃣ تنظيف السيرفر (على AWS)
```bash
ssh ubuntu@3.72.52.243
# ثم نفذ:
pm2 stop all && pm2 delete all && pm2 kill
cd ~ && rm -rf mobile-store backend frontend hotw
mongosh --eval "use mobile-store; db.dropDatabase();"
```

### 2️⃣ رفع على GitHub (على جهازك)
```bash
# شغل السكريبت:
upload-to-github.bat

# ثم:
# 1. اذهب إلى: https://github.com/new
# 2. أنشئ repository اسمه: mobile-store
# 3. نفذ:
git remote add origin https://github.com/YOUR-USERNAME/mobile-store.git
git push -u origin main
```

### 3️⃣ رفع Backend (على السيرفر)
```bash
ssh ubuntu@3.72.52.243

# استنسخ المشروع
git clone https://github.com/YOUR-USERNAME/mobile-store.git
cd mobile-store/backend

# إنشاء .env
cat > .env << EOF
PORT=4000
DATABASE_URL=mongodb://localhost:27017/mobile-store
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
EOF

# تثبيت وتشغيل
npm install
npm run build
pm2 start dist/server.js --name mobile-store-api
pm2 save

# اختبار
curl http://localhost:4000
```

### 4️⃣ رفع Frontend (على Vercel)
1. اذهب إلى: https://vercel.com
2. Import من GitHub → اختر `mobile-store`
3. Root Directory: `frontend`
4. Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `http://3.72.52.243`
5. Deploy!

### 5️⃣ تحديث CORS (على السيرفر)
```bash
# بعد ما تحصل على رابط Vercel
cd ~/mobile-store/backend
nano .env
# عدل FRONTEND_URL إلى رابط Vercel الجديد
pm2 restart mobile-store-api
```

---

## ✅ اختبار سريع

```bash
# Backend
curl http://3.72.52.243

# Frontend
# افتح: https://your-app.vercel.app
```

---

## 🔄 للتحديثات المستقبلية

### على جهازك:
```bash
git add .
git commit -m "تحديث"
git push
```

### على السيرفر:
```bash
ssh ubuntu@3.72.52.243
cd ~/mobile-store
./update-server.sh
```

### Frontend:
- يتحدث تلقائياً من GitHub! 🎉

---

## 📞 روابط مهمة

- **Backend**: http://3.72.52.243
- **Frontend**: https://your-app.vercel.app
- **GitHub**: https://github.com/YOUR-USERNAME/mobile-store
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## ❌ حل سريع للمشاكل

```bash
# على السيرفر
pm2 logs mobile-store-api          # اللوجات
pm2 restart mobile-store-api       # إعادة تشغيل
sudo systemctl status mongod       # حالة MongoDB
sudo systemctl restart nginx       # إعادة تشغيل Nginx
```

---

**للدليل الكامل**: راجع `دليل_الرفع_الكامل.md`
