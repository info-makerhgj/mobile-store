# 🚀 دليل نشر Backend على AWS

## الخيار 1: AWS EC2 (الأسهل والأرخص)

### الخطوة 1: إنشاء EC2 Instance

1. سجل دخول إلى [AWS Console](https://console.aws.amazon.com)
2. اذهب إلى EC2
3. اضغط "Launch Instance"
4. اختر:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (مجاني للسنة الأولى) أو t2.small
   - **Key Pair**: أنشئ key pair جديد وحمله
   - **Security Group**: 
     - SSH (22) - من IP الخاص بك
     - HTTP (80) - من أي مكان
     - HTTPS (443) - من أي مكان
     - Custom TCP (4000) - من أي مكان (للـ API)

### الخطوة 2: الاتصال بالسيرفر

```bash
# Windows (PowerShell)
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# إذا واجهت مشكلة في الصلاحيات على Windows:
icacls "your-key.pem" /inheritance:r
icacls "your-key.pem" /grant:r "%username%:R"
```

### الخطوة 3: تثبيت المتطلبات

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# تشغيل MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# تثبيت PM2 (لإدارة العمليات)
sudo npm install -g pm2

# تثبيت Git
sudo apt install -y git
```

### الخطوة 4: رفع الكود

```bash
# الطريقة 1: من GitHub
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend

# الطريقة 2: رفع مباشر (من جهازك)
# استخدم SCP أو FileZilla
scp -i "your-key.pem" -r backend ubuntu@your-ec2-ip:~/
```

### الخطوة 5: إعداد Backend

```bash
cd backend

# تثبيت Dependencies
npm install

# إنشاء ملف .env
nano .env
```

أضف المحتوى التالي:
```env
PORT=4000
DATABASE_URL=mongodb://localhost:27017/mobile-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production

# Tap Payment (إذا كنت تستخدمه)
TAP_SECRET_KEY=your-tap-secret-key
TAP_PUBLIC_KEY=your-tap-public-key
```

احفظ بـ `Ctrl+X` ثم `Y` ثم `Enter`

### الخطوة 6: Build وتشغيل

```bash
# Build
npm run build

# تشغيل بـ PM2
pm2 start dist/server.js --name mobile-store-api

# حفظ التكوين
pm2 save

# تشغيل تلقائي عند إعادة التشغيل
pm2 startup
# انسخ الأمر الذي يظهر ونفذه
```

### الخطوة 7: إعداد Nginx (Reverse Proxy)

```bash
# تثبيت Nginx
sudo apt install -y nginx

# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/mobile-store
```

أضف:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # أو IP الخاص بك

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# تفعيل التكوين
sudo ln -s /etc/nginx/sites-available/mobile-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### الخطوة 8: إعداد SSL (HTTPS) - اختياري

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com
```

### الخطوة 9: إعداد MongoDB للإنتاج

```bash
# الدخول إلى MongoDB
mongosh

# إنشاء مستخدم admin
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password-here",
  roles: ["root"]
})

# إنشاء مستخدم للتطبيق
use mobile-store
db.createUser({
  user: "mobilestore",
  pwd: "another-strong-password",
  roles: ["readWrite"]
})

exit
```

عدل ملف `.env`:
```env
DATABASE_URL=mongodb://mobilestore:another-strong-password@localhost:27017/mobile-store
```

أعد تشغيل التطبيق:
```bash
pm2 restart mobile-store-api
```

## الخيار 2: AWS Elastic Beanstalk (أسهل لكن أغلى)

### 1. تحضير المشروع

```bash
cd backend

# إنشاء ملف .ebextensions/nodecommand.config
mkdir .ebextensions
```

أنشئ ملف `.ebextensions/nodecommand.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

### 2. تثبيت EB CLI

```bash
pip install awsebcli
```

### 3. النشر

```bash
eb init -p node.js mobile-store-api --region us-east-1
eb create mobile-store-env
eb deploy
```

## الخيار 3: AWS Lambda + API Gateway (Serverless)

هذا الخيار أكثر تعقيداً ويحتاج تعديلات على الكود.

## اختبار Backend

```bash
# من جهازك
curl http://your-ec2-ip:4000
# أو
curl http://your-domain.com

# يجب أن ترى:
# {"message":"Mobile Store API - Running ✅"}
```

## أوامر PM2 المفيدة

```bash
# عرض العمليات
pm2 list

# عرض اللوجات
pm2 logs mobile-store-api

# إعادة التشغيل
pm2 restart mobile-store-api

# إيقاف
pm2 stop mobile-store-api

# حذف
pm2 delete mobile-store-api

# مراقبة الأداء
pm2 monit
```

## التحديثات المستقبلية

```bash
# على السيرفر
cd backend
git pull
npm install
npm run build
pm2 restart mobile-store-api
```

## النسخ الاحتياطي لقاعدة البيانات

```bash
# إنشاء نسخة احتياطية
mongodump --db mobile-store --out /home/ubuntu/backups/$(date +%Y%m%d)

# استعادة نسخة احتياطية
mongorestore --db mobile-store /home/ubuntu/backups/20250104/mobile-store
```

## مراقبة السيرفر

```bash
# استخدام الذاكرة
free -h

# استخدام القرص
df -h

# العمليات
htop

# لوجات النظام
sudo journalctl -u mongod -f
```

## الأمان

1. **غير المنافذ الافتراضية**
2. **استخدم Firewall**:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

3. **حدّث النظام بانتظام**:
```bash
sudo apt update && sudo apt upgrade -y
```

4. **استخدم Environment Variables** للمعلومات الحساسة

## التكلفة المتوقعة

- **t2.micro**: مجاني للسنة الأولى، ثم ~$8/شهر
- **t2.small**: ~$17/شهر
- **Elastic IP**: مجاني إذا كان مرتبط بـ instance يعمل
- **Storage**: ~$0.10/GB شهرياً

---

**بعد النشر**: حدّث `NEXT_PUBLIC_API_URL` في Vercel إلى رابط Backend الجديد!
