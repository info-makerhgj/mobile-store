# 🚀 دليل النشر السريع

## الترتيب الصحيح للنشر

### 1️⃣ Backend على AWS (أولاً)

```bash
# على جهازك
cd backend
zip -r backend.zip .

# رفع على EC2 (بعد إنشاء Instance)
scp -i "your-key.pem" backend.zip ubuntu@your-ec2-ip:~/

# على السيرفر
ssh -i "your-key.pem" ubuntu@your-ec2-ip
unzip backend.zip
cd backend
npm install
npm run build
pm2 start dist/server.js --name mobile-store-api
```

**احفظ رابط Backend**: `http://your-ec2-ip:4000`

### 2️⃣ Frontend على Vercel (ثانياً)

```bash
# على جهازك
cd frontend

# رفع على GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main

# على Vercel
# 1. اذهب إلى vercel.com
# 2. Import من GitHub
# 3. أضف Environment Variable:
#    NEXT_PUBLIC_API_URL = http://your-ec2-ip:4000
# 4. Deploy
```

### 3️⃣ تحديث CORS في Backend

```bash
# على السيرفر
nano backend/.env

# أضف:
FRONTEND_URL=https://your-app.vercel.app

# أعد التشغيل
pm2 restart mobile-store-api
```

## اختبار سريع

```bash
# اختبر Backend
curl http://your-ec2-ip:4000

# اختبر Frontend
# افتح https://your-app.vercel.app
```

## مشاكل شائعة

### Backend لا يعمل
```bash
pm2 logs mobile-store-api
```

### Frontend لا يتصل بـ Backend
- تأكد من `NEXT_PUBLIC_API_URL` صحيح في Vercel
- تأكد من Security Group في AWS يسمح بالمنفذ 4000

### MongoDB لا يعمل
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

---

**للمساعدة**: راجع `AWS_DEPLOYMENT_GUIDE_AR.md` و `VERCEL_DEPLOYMENT_AR.md`
