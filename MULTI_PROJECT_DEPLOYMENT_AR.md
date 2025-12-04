# 🔄 رفع مشروعين على نفس السيرفر

## الوضع الحالي
- ✅ عندك مشروع شغال على السيرفر
- ✅ تبغى ترفع مشروع ثاني (هذا المشروع)
- ✅ نفس حساب AWS

---

## هل بيصير مشاكل؟

### ✅ ما بيصير مشاكل إذا:

1. **استخدمت منافذ (Ports) مختلفة**
   - المشروع الأول: Port 5000
   - المشروع الثاني: Port 5001 (أو 3000، 4000، إلخ)

2. **استخدمت مجلدات منفصلة**
   - المشروع الأول: `~/project1/`
   - المشروع الثاني: `~/project2/`

3. **استخدمت قواعد بيانات منفصلة**
   - المشروع الأول: `database1`
   - المشروع الثاني: `database2`

4. **أعددت Nginx صح**
   - كل مشروع له domain أو subdomain مختلف
   - أو كل مشروع له path مختلف

### ⚠️ بيصير مشاكل إذا:

1. **استخدمت نفس المنفذ (Port)**
   - ❌ المشروعين على Port 5000 = تعارض!

2. **الذاكرة (RAM) مو كافية**
   - 2GB RAM قد تكون قليلة لمشروعين
   - راقب الاستهلاك

3. **استخدمت نفس قاعدة البيانات**
   - قد يحصل تعارض في البيانات

---

## السيناريوهات الممكنة

### السيناريو 1: مشروعين منفصلين تماماً ⭐ (موصى به)

```
السيرفر (52.66.189.199)
├── المشروع الأول
│   ├── Port: 5000
│   ├── Domain: project1.com
│   └── Database: mongodb://cluster/project1
│
└── المشروع الثاني (الجديد)
    ├── Port: 5001
    ├── Domain: project2.com
    └── Database: mongodb://cluster/project2
```

**المميزات:**
- ✅ لا تعارض
- ✅ سهل الإدارة
- ✅ كل مشروع مستقل

**العيوب:**
- ⚠️ يستهلك ذاكرة أكثر
- ⚠️ تحتاج domain ثاني (أو subdomain)

---

### السيناريو 2: مشروعين على نفس الـ Domain

```
project1.com/          → المشروع الأول (Port 5000)
project1.com/store/    → المشروع الثاني (Port 5001)
```

**المميزات:**
- ✅ domain واحد
- ✅ سهل للمستخدمين

**العيوب:**
- ⚠️ إعداد Nginx أصعب شوي
- ⚠️ قد يحصل تعارض في الـ routes

---

### السيناريو 3: Subdomains

```
project1.com           → المشروع الأول
store.project1.com     → المشروع الثاني
```

**المميزات:**
- ✅ منفصلين تماماً
- ✅ سهل الإدارة
- ✅ واضح للمستخدمين

**العيوب:**
- ⚠️ تحتاج إعداد DNS

---

## الإعداد الموصى به

### الخطوة 1: تحقق من المشروع الحالي

```bash
# اتصل بالسيرفر
ssh ubuntu@52.66.189.199

# شوف المشاريع الشغالة
pm2 list

# شوف المنافذ المستخدمة
sudo netstat -tulpn | grep LISTEN

# شوف استهلاك الذاكرة
free -h
htop
```

**اكتب النتائج:**
- المشروع الحالي يستخدم Port: _____
- استهلاك الذاكرة الحالي: _____
- المساحة المتبقية: _____

---

### الخطوة 2: اختر Port مختلف

إذا المشروع الأول على Port 5000، استخدم:
- Port 5001 للمشروع الثاني
- أو Port 3000
- أو Port 4000

---

### الخطوة 3: رفع المشروع الثاني

```bash
# على السيرفر
mkdir -p ~/project2
cd ~/project2

# على جهازك المحلي
cd backend
npm run build
tar -czf backend.tar.gz dist package.json package-lock.json
scp backend.tar.gz ubuntu@52.66.189.199:~/project2/

# على السيرفر
cd ~/project2
tar -xzf backend.tar.gz
npm install --production
```

---

### الخطوة 4: إعداد .env للمشروع الثاني

```bash
nano .env
```

```env
PORT=5001                    # ⚠️ منفذ مختلف!
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/project2  # ⚠️ قاعدة بيانات مختلفة!
JWT_SECRET=different-secret-for-project2  # ⚠️ سر مختلف!
FRONTEND_URL=https://your-frontend2.vercel.app
```

---

### الخطوة 5: تشغيل المشروع الثاني بـ PM2

```bash
cd ~/project2

# تشغيل بـ PM2 باسم مختلف
pm2 start dist/server.js --name project2

# حفظ
pm2 save

# التحقق
pm2 list
```

يجب أن تشوف:
```
┌─────┬──────────┬─────────┬──────┐
│ id  │ name     │ status  │ port │
├─────┼──────────┼─────────┼──────┤
│ 0   │ project1 │ online  │ 5000 │
│ 1   │ project2 │ online  │ 5001 │
└─────┴──────────┴─────────┴──────┘
```

---

### الخطوة 6: إعداد Nginx للمشروعين

#### الخيار A: Domains منفصلة

```bash
# ملف للمشروع الأول
sudo nano /etc/nginx/sites-available/project1
```

```nginx
server {
    listen 80;
    server_name project1.com www.project1.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# ملف للمشروع الثاني
sudo nano /etc/nginx/sites-available/project2
```

```nginx
server {
    listen 80;
    server_name project2.com www.project2.com;

    location /api {
        proxy_pass http://localhost:5001;  # ⚠️ منفذ مختلف!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل المواقع
sudo ln -s /etc/nginx/sites-available/project1 /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/project2 /etc/nginx/sites-enabled/

# اختبار
sudo nginx -t

# إعادة التشغيل
sudo systemctl restart nginx
```

---

#### الخيار B: Subdomain

```bash
sudo nano /etc/nginx/sites-available/projects
```

```nginx
# المشروع الأول
server {
    listen 80;
    server_name mysite.com www.mysite.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# المشروع الثاني
server {
    listen 80;
    server_name store.mysite.com;

    location /api {
        proxy_pass http://localhost:5001;  # ⚠️ منفذ مختلف!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

#### الخيار C: نفس الـ Domain بـ paths مختلفة

```bash
sudo nano /etc/nginx/sites-available/combined
```

```nginx
server {
    listen 80;
    server_name mysite.com;

    # المشروع الأول
    location /api/project1 {
        rewrite ^/api/project1/(.*) /api/$1 break;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # المشروع الثاني
    location /api/project2 {
        rewrite ^/api/project2/(.*) /api/$1 break;
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### الخطوة 7: إعداد قواعد البيانات المنفصلة

في MongoDB Atlas:

1. **استخدم نفس الـ Cluster**
2. **أنشئ databases منفصلة:**
   - `project1` للمشروع الأول
   - `project2` للمشروع الثاني

```
mongodb+srv://user:pass@cluster.mongodb.net/project1  # المشروع الأول
mongodb+srv://user:pass@cluster.mongodb.net/project2  # المشروع الثاني
```

---

### الخطوة 8: فتح المنفذ الجديد في Firewall

```bash
# فتح Port 5001
sudo ufw allow 5001

# التحقق
sudo ufw status
```

---

## مراقبة الموارد

### تحقق من استهلاك الذاكرة:

```bash
# استهلاك الذاكرة الإجمالي
free -h

# استهلاك كل process
pm2 monit

# تفصيلي
htop
```

**إذا الذاكرة أكثر من 80%:**
- ⚠️ ترقية السيرفر لـ 4GB
- أو استخدم MongoDB Atlas (يوفر ذاكرة)
- أو قلل عدد PM2 instances

---

## الأوامر المفيدة

### إدارة المشاريع:

```bash
# عرض كل المشاريع
pm2 list

# إعادة تشغيل مشروع معين
pm2 restart project1
pm2 restart project2

# إيقاف مشروع
pm2 stop project2

# حذف مشروع
pm2 delete project2

# logs لمشروع معين
pm2 logs project1
pm2 logs project2
```

### مراقبة المنافذ:

```bash
# شوف المنافذ المستخدمة
sudo netstat -tulpn | grep LISTEN

# شوف منفذ معين
sudo netstat -tulpn | grep 5000
sudo netstat -tulpn | grep 5001
```

---

## استكشاف الأخطاء

### المشروع الثاني ما يشتغل؟

```bash
# تحقق من الـ logs
pm2 logs project2 --lines 50

# تحقق من المنفذ
sudo netstat -tulpn | grep 5001

# تحقق من .env
cat ~/project2/.env

# أعد التشغيل
pm2 restart project2
```

### Port already in use؟

```bash
# شوف مين يستخدم المنفذ
sudo lsof -i :5001

# اقتل الـ process
sudo kill -9 <PID>

# أو غير المنفذ في .env
```

### Out of Memory؟

```bash
# شوف استهلاك الذاكرة
free -h

# شوف أكثر process يستهلك
ps aux --sort=-%mem | head

# الحل: ترقية السيرفر أو تقليل الـ processes
```

---

## التكاليف

### السيرفر الحالي (2GB):
- مجاني لأول 12 شهر
- بعدها: ~$10/شهر

### إذا احتجت ترقية لـ 4GB:
- ~$20/شهر

### MongoDB Atlas:
- Free Tier: 512MB (كافي لمشروعين صغار)
- M10: $57/شهر (إذا احتجت أكثر)

---

## التوصيات

### للبداية (2GB RAM):
✅ **يقدر يشغل:**
- مشروعين صغار
- MongoDB على Atlas (مو على السيرفر)
- زوار قليلين (100-200 متزامن)

⚠️ **راقب:**
- استهلاك الذاكرة
- سرعة الاستجابة
- الـ logs

### للنمو (4GB+ RAM):
✅ **أفضل لـ:**
- مشروعين متوسطين
- زوار أكثر (500+ متزامن)
- أداء أفضل

---

## الخلاصة

### ✅ نعم تقدر ترفع مشروعين على نفس السيرفر!

**الشروط:**
1. منافذ مختلفة (5000 و 5001)
2. مجلدات منفصلة
3. قواعد بيانات منفصلة
4. إعداد Nginx صحيح
5. مراقبة الموارد

**الخيار الأفضل:**
- استخدم **Subdomains** (store.mysite.com)
- أو **Domains منفصلة** (project1.com, project2.com)

**نصيحة:**
- ابدأ بالإعداد الحالي (2GB)
- راقب الأداء
- رقّي إذا احتجت

---

## 🎯 الخطوات السريعة

```bash
# 1. رفع المشروع الثاني
mkdir ~/project2
cd ~/project2
# ... رفع الملفات

# 2. إعداد .env بـ Port مختلف
nano .env  # PORT=5001

# 3. تشغيل بـ PM2
pm2 start dist/server.js --name project2
pm2 save

# 4. إعداد Nginx
sudo nano /etc/nginx/sites-available/project2
sudo ln -s /etc/nginx/sites-available/project2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. فتح المنفذ
sudo ufw allow 5001

# 6. اختبار
curl http://localhost:5001/api/health
```

---

**جاهز! 🚀 المشروعين بيشتغلون جنب بعض بدون مشاكل!**
