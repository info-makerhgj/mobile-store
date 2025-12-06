# 🔧 سكريبت لإصلاح جميع hardcoded URLs في المشروع

$files = @(
    "frontend/src/app/about/page.tsx",
    "frontend/src/app/admin/homepage-builder/page.tsx",
    "frontend/src/app/admin/settings/footer/page.tsx",
    "frontend/src/app/admin/settings/general/page.tsx",
    "frontend/src/app/admin/settings/shipping/page.tsx",
    "frontend/src/app/checkout/success/page.tsx",
    "frontend/src/app/checkout/page-complete.tsx",
    "frontend/src/app/checkout/page.tsx",
    "frontend/src/app/contact/page.tsx",
    "frontend/src/app/privacy/page.tsx",
    "frontend/src/app/return/page.tsx",
    "frontend/src/app/terms/page.tsx",
    "frontend/src/app/warranty/page.tsx",
    "frontend/src/components/layout/Footer.tsx",
    "frontend/src/components/AddressSelector.tsx",
    "frontend/src/components/ShippingSelector.tsx"
)

$totalFixed = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        # استبدال localhost:4000 بـ API_URL
        $content = $content -replace "http://localhost:4000/api", '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}'
        $content = $content -replace "'http://localhost:4000/api'", "(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api')"
        $content = $content -replace '"http://localhost:4000/api"', '(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api")'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            Write-Host "✅ Fixed: $file" -ForegroundColor Green
            $totalFixed++
        } else {
            Write-Host "⏭️  Skipped: $file (no changes)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Fixed $totalFixed files!" -ForegroundColor Cyan
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. git add ."
Write-Host "2. git commit -m 'Fix: استبدال جميع hardcoded URLs'"
Write-Host "3. git push origin main"
