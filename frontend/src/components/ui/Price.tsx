'use client'

import { useEffect, useState } from 'react'

interface PriceProps {
  value: number
  currency?: string
  className?: string
}

export default function Price({ value, currency = 'ر.س', className = '' }: PriceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // عرض بسيط أثناء التحميل
    return <span className={className}>{value} {currency}</span>
  }

  // بعد التحميل، استخدم toLocaleString
  return <span className={className}>{value.toLocaleString()} {currency}</span>
}
