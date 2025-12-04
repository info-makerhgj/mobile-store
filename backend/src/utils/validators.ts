import { ShippingAddress } from '../types/order'
import { ValidationError } from './errors'

/**
 * التحقق من رقم الجوال السعودي
 */
export function isValidSaudiPhone(phone: string): boolean {
  // يقبل: 05xxxxxxxx, 5xxxxxxxx, +9665xxxxxxxx, 9665xxxxxxxx
  const cleaned = phone.replace(/[\s-]/g, '')
  const patterns = [
    /^05\d{8}$/,           // 05xxxxxxxx
    /^5\d{8}$/,            // 5xxxxxxxx
    /^\+9665\d{8}$/,       // +9665xxxxxxxx
    /^9665\d{8}$/,         // 9665xxxxxxxx
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * التحقق من البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

/**
 * التحقق من عنوان الشحن
 */
export function validateShippingAddress(address: ShippingAddress): void {
  if (!address.fullName || address.fullName.trim().length < 3) {
    throw new ValidationError('الاسم الكامل مطلوب (3 أحرف على الأقل)', 'fullName')
  }
  
  if (!address.phone || !isValidSaudiPhone(address.phone)) {
    throw new ValidationError('رقم الجوال غير صحيح', 'phone')
  }
  
  if (!address.city || address.city.trim().length < 2) {
    throw new ValidationError('المدينة مطلوبة', 'city')
  }
  
  if (!address.district || address.district.trim().length < 2) {
    throw new ValidationError('الحي مطلوب', 'district')
  }
  
  if (!address.street || address.street.trim().length < 3) {
    throw new ValidationError('الشارع مطلوب', 'street')
  }
}

/**
 * التحقق من الكمية
 */
export function validateQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ValidationError('الكمية يجب أن تكون رقم صحيح أكبر من 0', 'quantity')
  }
  
  if (quantity > 99) {
    throw new ValidationError('الكمية القصوى هي 99', 'quantity')
  }
}

/**
 * تنظيف رقم الجوال
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '')
  
  // تحويل إلى صيغة 05xxxxxxxx
  if (cleaned.startsWith('+966')) {
    return '0' + cleaned.substring(4)
  }
  if (cleaned.startsWith('966')) {
    return '0' + cleaned.substring(3)
  }
  if (cleaned.startsWith('5')) {
    return '0' + cleaned
  }
  
  return cleaned
}
