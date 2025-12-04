# 🚀 النشر على السيرفر الموجود (Ubuntu-1)

## معلومات السيرفر
- **IP:** 52.66.189.199
- **المنطقة:** Mumbai, Zone A
- **المواصفات:** 2GB RAM, 2 vCPUs, 60GB SSD
- **النظام:** Ubuntu

---

## الخطوة 1: الاتصال بالسيرفر

### من Windows (PowerShell):
```powershell
ssh ubuntu@52.66.189.199
```

إذا طلب key file:
```powershell
ssh -i "path\to\your-key.pem" ubuntu@52.66.189.199
```

---

## الخطوة 2: تحديث النظام

```bash
# تحديث قائمة الحزم
sudo apt update

# ترقية الحزم
sudo apt upgrade -y

# تثبيت الأدوات الأساسية
sudo apt install -y curl wget git build-essential
```

---

## الخطوة 3: تثبيت Node.js 18

```bash
# إضافة مستودع Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# تثبيت Node.js
sudo apt install -y nodejs

# التحقق من التثبيت
node --version  # يجب أن يظهر v18.x.x
npm --version
```

---

## الخطوة 4: تثبيت PM2

```bash
# تثبيت PM2 عالمياً
sudo npm install -g pm2

# التحقق من التثبيت
pm2 --version
```

---

## الخطوة 5: تثبيت Nginx

```bash
# تثبيت Nginx
sudo apt install -y nginx

# تشغيل Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# التحقق من التشغيل
sudo systemctl status nginx
```

---

## الخطوة 6: إعداد Firewall

```bash
# تفعيل UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000  # للـ Backend (اختياري)
sudo ufw enable

# التحقق من القواعد
sudo ufw status
```

---

## الخطوة 7: رفع Backend

### على جهازك المحلي:

```bash
# بناء المشروع
cd backend
npm run build

# ضغط الملفات
tar -czf backend.tar.gz dist package.json package-lock.json

# رفع للسيرفر
scp backend.tar.gz ubuntu@52.66.189.199:~/
```

### على السيرفر:

```bash
# إنشاء مجلد للمشروع
mkdir -p ~/backend
cd ~/backend

# فك الضغط
tar -xzf ~/backend.tar.gz

# تثبيت الحزم
npm install --production

# إنشاء ملف .env
nano .env
```

**محتوى `.env`:**
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-random-key-change-this
FRONTEND_URL=http://52.66.189.199
TAP_SECRET_KEY=your_tap_secret_key
TAP_PUBLIC_KEY=your_tap_public_key
```

احفظ بـ `Ctrl+X` ثم `Y` ثم `Enter`

---

## الخطوة 8: تشغيل Backend بـ PM2

```bash
cd ~/backend

# تشغيل Backend
pm2 start dist/server.js --name backend

# حفظ الإعدادات
pm2 save

# تفعيل التشغيل التلقائي عند إعادة التشغيل
pm2 startup
# انسخ الأمر اللي يطلع وشغله

# التحقق من التشغيل
pm2 status
pm2 logs backend
```

---

## الخطوة 9: إعداد Nginx

```bash
# إنشاء ملف configuration
sudo nano /etc/nginx/sites-available/backend
```

**محتوى الملف:**
```nginx
server {
    listen 80;
    server_name 52.66.189.199;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/

# حذف الموقع الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# اختبار الإعدادات
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

---

## الخطوة 10: اختبار Backend

```bash
# من السيرفر
curl http://localhost:5000/api/health

# من جهازك
# افتح المتصفح واذهب إلى:
http://52.66.189.199/api/health
```

يجب أن يرجع استجابة مثل:
```json
{"status":"ok","timestamp":"..."}
```

---

## الخطوة 11: إعداد MongoDB Atlas

1. اذهب إلى https://www.mongodb.com/cloud/atlas
2. سجل دخول أو أنشئ حساب
3. أنشئ Cluster جديد (Free Tier)
4. اختر **AWS** كـ Cloud Provider
5. اختر **Mumbai (ap-south-1)** - نفس منطقة السيرفر
6. انتظر إنشاء الـ Cluster (5-10 دقائق)

### إعداد Database Access:
1. اذهب لـ "Database Access"
2. أضف User جديد
3. احفظ Username و Password

### إعداد Network Access:
1. اذهب لـ "Network Access"
2. أضف IP Address: `52.66.189.199` (IP السيرفر)
3. أو أضف `0.0.0.0/0` للسماح من أي مكان (للتطوير فقط)

### الحصول على Connection String:
1. اضغط "Connect"
2. اختر "Connect your application"
3. انسخ Connection String
4. استبدل `<password>` بكلمة المرور
5. استبدل `<dbname>` باسم قاعدة البيانات

---

## الخطوة 12: تحديث .env بـ MongoDB

```bash
cd ~/backend
nano .env
```

عدل `DATABASE_URL`:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mystore?retryWrites=true&w=majority
```

```bash
# إعادة تشغيل Backend
pm2 restart backend

# التحقق من الـ logs
pm2 logs backend
```

---

## الخطوة 13: نشر Frontend على Vercel

### على جهازك المحلي:

1. **ادفع الكود لـ GitHub:**
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. **اذهب إلى Vercel:**
- https://vercel.com
- سجل دخول بـ GitHub
- اضغط "New Project"
- اختر repository
- أضف Environment Variable:
  ```
  NEXT_PUBLIC_API_URL=http://52.66.189.199/api
  ```
- اضغط "Deploy"

3. **انتظر النشر** (2-3 دقائق)

4. **احصل على رابط Vercel** (مثل: `your-app.vercel.app`)

5. **حدث CORS في Backend:**
```bash
# على السيرفر
cd ~/backend
nano .env
```

عدل `FRONTEND_URL`:
```env
FRONTEND_URL=https://your-app.vercel.app
```

```bash
pm2 restart backend
```

---

## الخطوة 14: اختبار كامل

### اختبار Backend:
```bash
curl http://52.66.189.199/api/products
curl http://52.66.189.199/api/health
```

### اختبار Frontend:
1. افتح `https://your-app.vercel.app`
2. جرب تسجيل الدخول
3. جرب إضافة منتج للسلة
4. تحقق من الـ Network tab في Developer Tools

---

## الخطوة 15: المراقبة والصيانة

### مراقبة Backend:
```bash
# حالة PM2
pm2 status

# Logs مباشرة
pm2 logs backend

# استهلاك الموارد
pm2 monit

# معلومات النظام
htop  # اضغط q للخروج
```

### مراقبة Nginx:
```bash
# حالة Nginx
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### مراقبة الذاكرة:
```bash
free -h
df -h
```

---

## الأوامر المفيدة

### PM2:
```bash
pm2 restart backend    # إعادة تشغيل
pm2 stop backend       # إيقاف
pm2 delete backend     # حذف
pm2 logs backend       # عرض logs
pm2 flush backend      # مسح logs
```

### Nginx:
```bash
sudo systemctl restart nginx   # إعادة تشغيل
sudo systemctl stop nginx      # إيقاف
sudo systemctl start nginx     # تشغيل
sudo nginx -t                  # اختبار الإعدادات
```

### النظام:
```bash
sudo reboot           # إعادة تشغيل السيرفر
sudo shutdown -h now  # إيقاف السيرفر
```

---

## استكشاف الأخطاء

### Backend لا يعمل؟
```bash
# تحقق من الـ logs
pm2 logs backend --lines 100

# تحقق من المنفذ
sudo netstat -tulpn | grep 5000

# تحقق من .env
cat ~/backend/.env

# أعد التشغيل
pm2 restart backend
```

### Nginx لا يعمل؟
```bash
# تحقق من الحالة
sudo systemctl status nginx

# تحقق من الإعدادات
sudo nginx -t

# تحقق من الـ logs
sudo tail -f /var/log/nginx/error.log
```

### MongoDB Connection Error؟
```bash
# تحقق من Connection String
cat ~/backend/.env | grep DATABASE_URL

# تحقق من Network Access في Atlas
# تأكد من إضافة IP السيرفر: 52.66.189.199
```

---

## التحديثات المستقبلية

### تحديث Backend:
```bash
# على جهازك
cd backend
npm run build
tar -czf backend.tar.gz dist package.json

# رفع للسيرفر
scp backend.tar.gz ubuntu@52.66.189.199:~/

# على السيرفر
cd ~/backend
tar -xzf ~/backend.tar.gz
npm install --production
pm2 restart backend
```

### تحديث Frontend:
```bash
# على جهازك
cd frontend
git add .
git commit -m "Update"
git push

# Vercel ينشر تلقائياً!
```

---

## الأمان

### تغيير SSH Port (اختياري):
```bash
sudo nano /etc/ssh/sshd_config
# غير Port 22 لرقم آخر مثل 2222
sudo systemctl restart sshd
sudo ufw allow 2222
```

### تفعيل Fail2Ban:
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🎉 تم النشر بنجاح!

**Backend:** http://52.66.189.199/api
**Frontend:** https://your-app.vercel.app

---

**ملاحظة مهمة:** 
- السيرفر في Mumbai قد يكون بعيد عن عملائك
- فكر في نقله لـ Bahrain (me-south-1) لاحقاً
- راقب استهلاك الذاكرة (2GB قد تكون قليلة)

**للدعم:** راجع الـ logs دائماً عند حدوث مشكلة!
