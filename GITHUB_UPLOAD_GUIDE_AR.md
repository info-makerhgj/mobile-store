# 📤 دليل رفع المشروع على GitHub

## الخطوة 1: تثبيت Git (إذا لم يكن مثبتاً)

### على Windows:
1. حمّل Git من: https://git-scm.com/download/win
2. ثبّته بالإعدادات الافتراضية
3. أعد تشغيل PowerShell أو CMD

### تحقق من التثبيت:
```bash
git --version
```

## الخطوة 2: إعداد Git (أول مرة فقط)

```bash
git config --global user.name "اسمك"
git config --global user.email "your-email@example.com"
```

## الخطوة 3: إنشاء Repository على GitHub

1. اذهب إلى https://github.com
2. سجل دخول (أو أنشئ حساب جديد)
3. اضغط على زر **"+"** في الأعلى
4. اختر **"New repository"**
5. املأ المعلومات:
   - **Repository name**: `mobile-store` (أو أي اسم تريده)
   - **Description**: "متجر إلكتروني للجوالات"
   - **Public** أو **Private** (اختر حسب رغبتك)
   - **لا تختر** "Add a README file"
   - **لا تختر** "Add .gitignore"
   - اضغط **"Create repository"**

6. **احفظ رابط الـ repository** (سيكون مثل):
   ```
   https://github.com/your-username/mobile-store.git
   ```

## الخطوة 4: رفع المشروع

### افتح PowerShell أو CMD في مجلد المشروع:

```bash
# تأكد أنك في المجلد الرئيسي للمشروع
cd C:\Users\cct33\Downloads\hotw

# الخطوة 1: تهيئة Git
git init

# الخطوة 2: إضافة جميع الملفات
git add .

# الخطوة 3: عمل Commit أول
git commit -m "Initial commit - Mobile Store Project"

# الخطوة 4: تسمية الـ branch الرئيسي
git branch -M main

# الخطوة 5: ربط المشروع بـ GitHub
# استبدل YOUR-USERNAME باسم المستخدم الخاص بك
git remote add origin https://github.com/YOUR-USERNAME/mobile-store.git

# الخطوة 6: رفع الملفات
git push -u origin main
```

### إذا طلب منك تسجيل الدخول:
- أدخل username الخاص بـ GitHub
- أدخل **Personal Access Token** (ليس كلمة المرور!)

## الخطوة 5: إنشاء Personal Access Token

إذا لم يكن لديك Token:

1. اذهب إلى GitHub
2. اضغط على صورتك في الأعلى → **Settings**
3. في القائمة اليسرى، اذهب إلى **Developer settings** (في الأسفل)
4. اختر **Personal access tokens** → **Tokens (classic)**
5. اضغط **Generate new token** → **Generate new token (classic)**
6. املأ المعلومات:
   - **Note**: "Mobile Store Upload"
   - **Expiration**: 90 days (أو حسب رغبتك)
   - **Select scopes**: اختر **repo** (كل الصلاحيات)
7. اضغط **Generate token**
8. **انسخ الـ Token فوراً** (لن تراه مرة أخرى!)

استخدم هذا الـ Token بدلاً من كلمة المرور عند الرفع.

## الخطوة 6: التحقق من الرفع

1. اذهب إلى repository على GitHub
2. يجب أن ترى جميع ملفات المشروع
3. تأكد من وجود:
   - مجلد `frontend`
   - مجلد `backend`
   - ملف `.gitignore`
   - ملفات التوثيق

## أوامر Git مفيدة للمستقبل

### عند إضافة تعديلات جديدة:
```bash
# إضافة التعديلات
git add .

# عمل commit
git commit -m "وصف التعديل"

# رفع على GitHub
git push
```

### عرض حالة الملفات:
```bash
git status
```

### عرض سجل الـ commits:
```bash
git log --oneline
```

### إلغاء تعديلات لم يتم commit لها:
```bash
git checkout -- .
```

## مشاكل شائعة وحلولها

### 1. خطأ "fatal: not a git repository"
```bash
# تأكد أنك في المجلد الصحيح
cd C:\Users\cct33\Downloads\hotw
git init
```

### 2. خطأ "remote origin already exists"
```bash
# احذف الـ remote القديم
git remote remove origin

# أضف الجديد
git remote add origin https://github.com/YOUR-USERNAME/mobile-store.git
```

### 3. خطأ في المصادقة
- استخدم Personal Access Token بدلاً من كلمة المرور
- أو استخدم GitHub Desktop (أسهل)

### 4. الملفات كبيرة جداً
```bash
# إذا كان حجم node_modules كبير، تأكد من .gitignore
# ثم:
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

## بديل أسهل: GitHub Desktop

إذا واجهت صعوبة مع الأوامر:

1. حمّل GitHub Desktop: https://desktop.github.com
2. سجل دخول بحساب GitHub
3. اختر **File** → **Add Local Repository**
4. اختر مجلد المشروع
5. اضغط **Publish repository**

## الخطوة التالية

بعد رفع المشروع على GitHub:
✅ انتقل إلى **VERCEL_DEPLOYMENT_AR.md** لنشر Frontend
✅ ثم **AWS_DEPLOYMENT_GUIDE_AR.md** لنشر Backend

---

**ملاحظة مهمة**: لا ترفع ملفات `.env` على GitHub! (الـ `.gitignore` يمنع ذلك تلقائياً)
