import { OrderItem } from '../types/order'

/**
 * حساب المجموع الفرعي للمنتجات
 */
export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0)
}

/**
 * حساب تكلفة الشحن حسب المدينة
 */
export function calculateShipping(city: string): number {
  const shippingRates: { [key: string]: number } = {
    'الرياض': 0,
    'جدة': 25,
    'الدمام': 30,
    'مكة': 25,
    'المدينة': 30,
    'الطائف': 35,
    'تبوك': 40,
    'القصيم': 35,
    'حائل': 40,
    'جازان': 45,
    'نجران': 45,
    'الباحة': 40,
    'الجوف': 45,
    'عرعر': 50,
  }
  
  // شحن مجاني للرياض، أو حسب المدينة، أو 30 ريال افتراضي
  return shippingRates[city] || 30
}

/**
 * حساب الضريبة (15%)
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.15 * 100) / 100
}

/**
 * حساب الإجمالي النهائي
 */
export function calculateTotal(
  subtotal: number,
  shippingCost: number,
  tax: number,
  discount: number = 0
): number {
  return subtotal + shippingCost + tax - discount
}

/**
 * حساب رسوم الدفع عند الاستلام
 */
export async function calculateCODFee(subtotal: number, paymentMethod: string): Promise<number> {
  if (paymentMethod !== 'cod') {
    return 0
  }
  
  try {
    const { MongoClient } = require('mongodb')
    const mongoUrl = MONGODB_URI;
    const client = new MongoClient(mongoUrl)
    
    await client.connect()
    const db = client.db()
    
    const codSettings = await db.collection('PaymentSettings').findOne({ provider: 'cod' })
    await client.close()
    
    if (!codSettings || !codSettings.enabled || !codSettings.config) {
      return 0
    }
    
    const fee = parseFloat(codSettings.config.fee || 0)
    const feeType = codSettings.config.feeType || 'fixed'
    
    if (feeType === 'percentage') {
      return Math.round(subtotal * (fee / 100) * 100) / 100
    } else {
      return fee
    }
  } catch (error) {
    console.error('Error calculating COD fee:', error)
    return 0
  }
}

/**
 * حساب تفاصيل السعر الكاملة
 */
export function calculateOrderPricing(items: OrderItem[], city: string, discount: number = 0, codFee: number = 0) {
  const subtotal = calculateSubtotal(items)
  const shippingCost = calculateShipping(city)
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, shippingCost, tax, discount) + codFee
  
  return {
    subtotal,
    shippingCost,
    tax,
    discount,
    codFee,
    total,
  }
}
