export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  subtotal: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  email?: string
  city: string
  district: string
  street: string
  buildingNumber?: string
  additionalInfo?: string
}

export interface Order {
  _id?: any
  orderNumber: string
  
  // Customer Info
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  
  // Items
  items: OrderItem[]
  
  // Pricing
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  codFee?: number
  total: number
  
  // Shipping
  shippingAddress: ShippingAddress
  
  // Payment
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string
  
  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  
  // Tracking
  trackingNumber?: string
  estimatedDelivery?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  shippedAt?: Date
  deliveredAt?: Date
  
  // Notes
  customerNotes?: string
  adminNotes?: string
  
  // History
  statusHistory: Array<{
    status: string
    timestamp: Date
    note?: string
  }>
}

export interface CreateOrderDTO {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: ShippingAddress
  paymentMethod: string
  customerNotes?: string
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  // الأسعار المحسوبة مسبقاً (اختياري)
  subtotal?: number
  shippingCost?: number
  tax?: number
  discount?: number
  codFee?: number
  total?: number
  // معلومات الدفع
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string
}
