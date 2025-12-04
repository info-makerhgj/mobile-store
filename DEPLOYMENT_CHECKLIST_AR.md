# ✅ قائمة التحقق قبل النشر

## قبل النشر

### Backend (AWS)
- [ ] تحديث `.env` بالقيم الحقيقية
- [ ] تغيير `JWT_SECRET` إلى قيمة قوية
- [ ] إعداد MongoDB بمستخدم وكلمة مرور
- [ ] تفعيل CORS للـ domain الخاص بـ Vercel
- [ ] اختبار جميع API endpoints
- [ ] إعداد SSL/HTTPS
- [ ] إعداد النسخ الاحتياطي التلقائي

### Frontend (Vercel)
- [ ] تحديث `NEXT_PUBLIC_API_URL` في Vercel
- [ ] اختبار Build محلياً (`npm run build`)
- [ ] رفع الكود على GitHub
- [ ] إضافة Environment Variables في Vercel
- [ ] اختبار جميع الصفحات بعد النشر

### قاعدة البيانات
- [ ] إنشاء مستخدم admin أول
- [ ] إضافة منتجات تجريبية
- [ ] اختبار الطلبات
- [ ] إعداد النسخ الاحتياطي

### الأمان
- [ ] تغيير جميع كلمات المرور الافتراضية
- [ ] تفعيل Firewall على AWS
- [ ] استخدام HTTPS فقط
- [ ] إخفاء معلومات الخطأ في Production
- [ ] تحديد rate limiting للـ API

## بعد النشر

### اختبار شامل
- [ ] تسجيل دخول المدير
- [ ] إضافة منتج جديد
- [ ] إنشاء طلب تجريبي
- [ ] اختبار الدفع
- [ ] اختبار الشحن
- [ ] اختبار على الجوال
- [ ] اختبار السرعة

### المراقبة
- [ ] إعداد مراقبة السيرفر (uptime monitoring)
- [ ] إعداد تنبيهات الأخطاء
- [ ] مراقبة استخدام الموارد
- [ ] مراقبة قاعدة البيانات

### التوثيق
- [ ] توثيق عملية النشر
- [ ] توثيق بيانات الدخول (في مكان آمن)
- [ ] توثيق إعدادات DNS
- [ ] توثيق خطة النسخ الاحتياطي

## روابط مهمة

- Frontend: https://your-app.vercel.app
- Backend: https://your-backend-url.com
- Admin Panel: https://your-app.vercel.app/admin
- AWS Console: https://console.aws.amazon.com
- Vercel Dashboard: https://vercel.com/dashboard

## معلومات الاتصال بالسيرفر

```bash
# SSH إلى EC2
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# MongoDB
mongosh mongodb://username:password@localhost:27017/mobile-store
```

## أوامر مفيدة

```bash
# إعادة تشغيل Backend
pm2 restart mobile-store-api

# عرض اللوجات
pm2 logs mobile-store-api

# نسخة احتياطية للقاعدة
mongodump --db mobile-store --out ~/backups/$(date +%Y%m%d)

# تحديث الكود
cd backend
git pull
npm install
npm run build
pm2 restart mobile-store-api
```

## جهات الاتصال للطوارئ

- مطور Backend: [رقم الهاتف]
- مطور Frontend: [رقم الهاتف]
- مدير النظام: [رقم الهاتف]

---

**تاريخ النشر**: ___________
**نشر بواسطة**: ___________
