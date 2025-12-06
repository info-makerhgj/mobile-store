# 🚀 تحديث Backend على AWS

## ✅ التعديل المطلوب:
أضفت `/api/health` endpoint في `backend/src/server.ts`

---

## 📤 خطوات رفع التحديث:

### الطريقة 1: رفع الملف المعدل فقط

```bash
# 1. اتصل بالسيرفر
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. اذهب لمجلد Backend
cd ~/mobile-store/backend

# 3. افتح الملف للتعديل
nano src/server.ts

# 4. أضف هذا الكود بعد app.get('/', ...)
```

```typescript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})
```

```bash
# 5. احفظ الملف (Ctrl+O ثم Enter ثم Ctrl+X)

# 6. أعد تشغيل Backend
pm2 restart backend

# 7. تحقق من الـ logs
pm2 logs backend --lines 20
```

---

### الطريقة 2: رفع المشروع كامل من جديد

```bash
# على جهازك المحلي:

# 1. اعمل commit للتعديلات
git add .
git commit -m "Add health check endpoint"
git push

# 2. على السيرفر:
ssh -i your-key.pem ubuntu@your-ec2-ip

cd ~/mobile-store
git pull

cd backend
npm run build
pm2 restart backend
pm2 logs backend
```

---

### الطريقة 3: نسخ الملف مباشرة (الأسرع)

```bash
# على جهازك المحلي:
scp -i your-key.pem backend/src/server.ts ubuntu@your-ec2-ip:~/mobile-store/backend/src/

# ثم على السيرفر:
ssh -i your-key.pem ubuntu@your-ec2-ip
cd ~/mobile-store/backend
npm run build
pm2 restart backend
```

---

## 🧪 اختبار بعد التحديث:

```bash
# من السيرفر نفسه:
curl http://localhost:4000/api/health

# من المتصفح:
https://api.ab-tw.com/api/health
```

**يجب أن يرجع:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2025-12-06T..."
}
```

---

## 🔧 إذا ما اشتغل:

### تحقق من الـ Build:
```bash
cd ~/mobile-store/backend
npm run build
# شوف إذا فيه أخطاء
```

### تحقق من PM2:
```bash
pm2 status
pm2 logs backend --lines 50
```

### تحقق من Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📝 ملاحظات:

1. **بعد أي تعديل في TypeScript لازم:**
   ```bash
   npm run build
   pm2 restart backend
   ```

2. **إذا Backend مو شغال أصلاً:**
   ```bash
   cd ~/mobile-store/backend
   npm run build
   pm2 start dist/server.js --name backend
   pm2 save
   ```

3. **تحقق من Environment Variables:**
   ```bash
   cat ~/mobile-store/backend/.env
   ```

---

## ✅ بعد التحديث:

1. جرب: `https://api.ab-tw.com/api/health`
2. إذا اشتغل، جرب: `https://api.ab-tw.com/api/products`
3. افتح موقعك على Vercel وشوف إذا الأخطاء راحت

---

**أخبرني بعد ما تحدث السيرفر!** 🚀
