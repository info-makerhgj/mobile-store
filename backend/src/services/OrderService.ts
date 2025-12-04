import { MongoClient, ObjectId } from 'mongodb'
import { Order, CreateOrderDTO, OrderItem } from '../types/order'
import { calculateOrderPricing } from '../utils/calculations'
import { validateShippingAddress, validateQuantity, normalizePhone } from '../utils/validators'
import { ValidationError, StockError, OrderNotFoundError } from '../utils/errors'

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store'

export class OrderService {
  /**
   * إنشاء طلب جديد
   */
  async createOrder(userId: string | null, orderData: CreateOrderDTO): Promise<Order> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      // 1. التحقق من السلة
      if (!orderData.items || orderData.items.length === 0) {
        throw new ValidationError('السلة فارغة')
      }
      
      // 2. التحقق من عنوان الشحن
      validateShippingAddress(orderData.shippingAddress)
      
      // 3. جلب معلومات المستخدم (إذا كان مسجل دخول)
      let user = null
      if (userId) {
        user = await db.collection('User').findOne({ _id: new ObjectId(userId) })
      }
      
      // 4. التحقق من المنتجات والمخزون
      const orderItems: OrderItem[] = []
      
      for (const item of orderData.items) {
        validateQuantity(item.quantity)
        
        const product = await db.collection('Product').findOne({ _id: new ObjectId(item.productId) })
        
        if (!product) {
          throw new ValidationError(`المنتج غير موجود`)
        }
        
        // التحقق من المخزون (إذا كان موجود)
        if (product.stock !== undefined && product.stock < item.quantity) {
          throw new StockError(
            `المنتج "${product.nameAr || product.nameEn}" غير متوفر بالكمية المطلوبة. المتوفر: ${product.stock}`,
            item.productId
          )
        }
        
        orderItems.push({
          productId: item.productId,
          productName: product.nameAr || product.nameEn || 'منتج',
          productImage: product.images?.[0] || product.image || '',
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity,
        })
      }
      
      // 5. حساب الأسعار
      // إذا كانت البيانات تحتوي على الأسعار المحسوبة مسبقاً، نستخدمها
      let pricing
      if (orderData.total && orderData.subtotal !== undefined) {
        pricing = {
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
          codFee: orderData.codFee || 0,
          total: orderData.total,
        }
      } else {
        // وإلا نحسبها من جديد
        const { calculateCODFee } = require('../utils/calculations')
        const subtotalTemp = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
        const codFee = await calculateCODFee(subtotalTemp, orderData.paymentMethod)
        pricing = calculateOrderPricing(orderItems, orderData.shippingAddress.city, 0, codFee)
      }
      
      // 7. توليد رقم الطلب
      const orderCount = await db.collection('Order').countDocuments()
      const orderNumber = `#${(orderCount + 10001).toString()}`
      
      // 8. تنظيف رقم الجوال
      const normalizedPhone = normalizePhone(orderData.shippingAddress.phone)
      
      // 9. إنشاء الطلب
      const order: Omit<Order, '_id'> = {
        orderNumber,
        
        // Customer Info
        userId: userId || undefined,
        customerName: user?.name || orderData.shippingAddress.fullName,
        customerEmail: user?.email || orderData.shippingAddress.email || '',
        customerPhone: normalizedPhone,
        
        // Items
        items: orderItems,
        
        // Pricing
        subtotal: pricing.subtotal,
        shippingCost: pricing.shippingCost,
        tax: pricing.tax,
        discount: pricing.discount,
        ...(pricing.codFee && pricing.codFee > 0 ? { codFee: pricing.codFee } : {}),
        total: pricing.total,
        
        // Shipping
        shippingAddress: {
          ...orderData.shippingAddress,
          phone: normalizedPhone,
        },
        
        // Payment
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus || 'pending',
        ...(orderData.paymentId ? { paymentId: orderData.paymentId } : {}),
        
        // Status
        // للدفع عبر Tap: إنشاء كمسودة (draft) حتى يتم تأكيد الدفع
        // للدفع عند الاستلام: مؤكد مباشرة (confirmed)
        status: orderData.status || (orderData.paymentMethod === 'cod' ? 'confirmed' : 'pending'),
        
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmedAt: orderData.paymentMethod === 'cod' ? new Date() : undefined,
        
        // Notes
        customerNotes: orderData.customerNotes,
        
        // History
        statusHistory: [
          {
            status: orderData.paymentMethod === 'cod' ? 'confirmed' : 'pending',
            timestamp: new Date(),
            note: orderData.paymentMethod === 'cod' ? 'طلب مؤكد - الدفع عند الاستلام' : 'طلب جديد - في انتظار الدفع',
          },
        ],
      }
      
      const result = await db.collection('Order').insertOne(order)
      
      return {
        ...order,
        _id: result.insertedId,
      } as Order
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * تأكيد الطلب بعد نجاح الدفع
   */
  async confirmOrder(orderId: string, paymentId: string): Promise<Order> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      const result = await db.collection('Order').findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentId,
            confirmedAt: new Date(),
            updatedAt: new Date(),
          },
          $push: {
            statusHistory: {
              $each: [{
                status: 'confirmed',
                timestamp: new Date(),
                note: 'تم تأكيد الدفع بنجاح',
              }]
            },
          } as any,
        },
        { returnDocument: 'after' }
      )
      
      if (!result) {
        throw new OrderNotFoundError(orderId)
      }
      
      return result as unknown as Order
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * إلغاء الطلب
   */
  async cancelOrder(orderId: string, reason: string = 'ألغاه العميل'): Promise<Order> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      const result = await db.collection('Order').findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: 'cancelled',
            updatedAt: new Date(),
          },
          $push: {
            statusHistory: {
              $each: [{
                status: 'cancelled',
                timestamp: new Date(),
                note: reason,
              }]
            },
          } as any,
        },
        { returnDocument: 'after' }
      )
      
      if (!result) {
        throw new OrderNotFoundError(orderId)
      }
      
      return result as unknown as Order
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * جلب طلب واحد
   */
  async getOrder(orderId: string, userId?: string): Promise<Order> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      // البحث بـ _id أو orderNumber
      let query: any
      if (ObjectId.isValid(orderId) && orderId.length === 24) {
        query = { _id: new ObjectId(orderId) }
      } else {
        // البحث بـ orderNumber (مثل #10001)
        query = { orderNumber: orderId }
      }
      
      if (userId) {
        query.userId = userId
      }
      
      const order = await db.collection('Order').findOne(query)
      
      if (!order) {
        throw new OrderNotFoundError(orderId)
      }
      
      return order as Order
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * جلب طلبات المستخدم
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      const orders = await db.collection('Order')
        .find({ 
          userId,
          status: { $ne: 'pending' } // لا نعرض الطلبات المعلقة
        })
        .sort({ createdAt: -1 })
        .toArray()
      
      return orders as Order[]
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * جلب جميع الطلبات (للأدمن)
   */
  async getAllOrders(): Promise<Order[]> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      // إخفاء الطلبات المسودة (DRAFT) من لوحة التحكم
      const orders = await db.collection('Order')
        .find({ status: { $ne: 'draft' } })
        .sort({ createdAt: -1 })
        .toArray()
      
      return orders as Order[]
      
    } finally {
      await client.close()
    }
  }
  
  /**
   * تحديث حالة الطلب (للأدمن)
   */
  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    note?: string,
    trackingNumber?: string
  ): Promise<Order> {
    const client = new MongoClient(mongoUrl)
    
    try {
      await client.connect()
      const db = client.db()
      
      const updateData: any = {
        status,
        updatedAt: new Date(),
      }
      
      if (status === 'shipped') {
        updateData.shippedAt = new Date()
        if (trackingNumber) {
          updateData.trackingNumber = trackingNumber
        }
      }
      
      if (status === 'delivered') {
        updateData.deliveredAt = new Date()
      }
      
      const result = await db.collection('Order').findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        {
          $set: updateData,
          $push: {
            statusHistory: {
              $each: [{
                status,
                timestamp: new Date(),
                note: note || `تم تحديث الحالة إلى ${status}`,
              }]
            },
          } as any,
        },
        { returnDocument: 'after' }
      )
      
      if (!result) {
        throw new OrderNotFoundError(orderId)
      }
      
      return result as unknown as Order
      
    } finally {
      await client.close()
    }
  }
}
