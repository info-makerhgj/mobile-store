# 🔍 تشخيص مشكلة الاتصال بالـ API

## المشكلة الحالية:
- Frontend على Vercel يحاول الاتصال بـ `https://api.ab-tw.com`
- Backend على AWS (المفترض على `https://api.ab-tw.com`)
- الأخطاء:
  - `ERR_CONNECTION_TIMED_OUT` - السيرفر لا يرد
  - `404` على بعض الـ endpoints
  - `ERR_CONNECTION_REFUSED` على localhost:4000

---

## خطوات التشخيص:

### 1️⃣ تحقق من حالة Backend على AWS

افتح Terminal وجرب:

```bash
# تحقق من أن السيرفر شغال
curl https://api.ab-tw.com/api/health

# أو
curl https://api.ab-tw.com/api/products
```

**إذا طلع خطأ:**
- السيرفر مطفي أو معلق
- المشكلة في DNS
- المشكلة في SSL Certificate
- Firewall يمنع الاتصال

---

### 2️⃣ تحقق من إعدادات Vercel

اذهب إلى Vercel Dashboard:
1. افتح مشروعك
2. اذهب لـ **Settings** → **Environment Variables**
3. تحقق من قيمة `NEXT_PUBLIC_API_URL`

**يجب أن تكون:**
```
NEXT_PUBLIC_API_URL=https://api.ab-tw.com/api
```

**⚠️ مهم:** إذا غيرت أي environment variable، لازم تعمل **Redeploy** للمشروع!

---

### 3️⃣ تحقق من Backend على AWS

#### A. تحقق من EC2 Instance:
```bash
# اتصل بالسيرفر
ssh -i your-key.pem ubuntu@your-ec2-ip

# تحقق من أن Node.js شغال
pm2 status
# أو
pm2 list

# شوف الـ logs
pm2 logs backend

# إذا مطفي، شغله
pm2 start backend
pm2 save
```

#### B. تحقق من Nginx:
```bash
# تحقق من حالة Nginx
sudo systemctl status nginx

# إذا مطفي، شغله
sudo systemctl start nginx

# شوف الـ logs
sudo tail -f /var/log/nginx/error.log
```

#### C. تحقق من Domain & SSL:
```bash
# تحقق من SSL Certificate
sudo certbot certificates

# إذا منتهي، جدده
sudo certbot renew
```

---

### 4️⃣ تحقق من Firewall & Security Groups

#### على AWS:
1. اذهب لـ EC2 Dashboard
2. اختر الـ Instance
3. اذهب لـ **Security Groups**
4. تأكد من فتح:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 4000 (إذا تستخدم direct access)

#### على السيرفر نفسه:
```bash
# تحقق من UFW
sudo ufw status

# إذا محتاج تفتح ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 4000
```

---

### 5️⃣ تحقق من MongoDB

```bash
# على السيرفر
mongosh

# أو تحقق من Atlas
# اذهب لـ MongoDB Atlas Dashboard
# تحقق من أن الـ Cluster شغال
# تحقق من IP Whitelist
```

---

## الحلول السريعة:

### ✅ الحل 1: إعادة تشغيل Backend
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
pm2 restart backend
pm2 logs backend --lines 50
```

### ✅ الحل 2: تحديث Environment Variables في Vercel
1. اذهب لـ Vercel Dashboard
2. Settings → Environment Variables
3. عدل `NEXT_PUBLIC_API_URL` إلى القيمة الصحيحة
4. اضغط **Save**
5. اذهب لـ **Deployments**
6. اضغط على آخر deployment
7. اضغط **Redeploy**

### ✅ الحل 3: إذا Domain مو شغال
استخدم IP مباشرة مؤقتاً:
```
NEXT_PUBLIC_API_URL=http://your-ec2-ip:4000/api
```

---

## اختبار سريع:

### من المتصفح:
افتح:
- `https://api.ab-tw.com/api/health`
- `https://api.ab-tw.com/api/products`

### من Terminal:
```bash
curl -I https://api.ab-tw.com/api/health
```

---

## معلومات إضافية محتاجها:

1. **هل Domain (api.ab-tw.com) موجه صح للـ EC2 IP؟**
   - تحقق من DNS Settings في Domain Provider

2. **هل SSL Certificate مثبت ويشتغل؟**
   - جرب `https://api.ab-tw.com` في المتصفح

3. **هل Backend شغال على السيرفر؟**
   - `pm2 status` على السيرفر

4. **هل MongoDB متصل؟**
   - شوف logs: `pm2 logs backend`

---

## 📞 أخبرني:

1. وش يطلع لما تفتح `https://api.ab-tw.com/api/health` في المتصفح؟
2. هل Backend شغال على السيرفر؟ (pm2 status)
3. وش قيمة `NEXT_PUBLIC_API_URL` في Vercel؟
