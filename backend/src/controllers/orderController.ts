import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { OrderService } from '../services/OrderService'
import { ValidationError, StockError, OrderNotFoundError, UnauthorizedError } from '../utils/errors'

const orderService = new OrderService()

/**
 * إنشاء طلب جديد
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // استخدام userId من token أو من البيانات المُرسلة (_forceUserId)
    const userId = req.user?.userId || req.body._forceUserId || null
    const orderData = req.body
    
    console.log('📝 Creating order...')
    console.log('   User ID from token:', req.user?.userId || 'None')
    console.log('   User ID from data:', req.body._forceUserId || 'None')
    console.log('   Final User ID:', userId || 'Guest')
    console.log('   Payment Method:', orderData.paymentMethod)
    console.log('   Payment Status:', orderData.paymentStatus)
    
    // حذف _forceUserId من orderData قبل إنشاء الطلب
    delete orderData._forceUserId
    
    const order = await orderService.createOrder(userId, orderData)
    
    console.log('✅ Order created successfully!')
    console.log('   Order Number:', order.orderNumber)
    console.log('   User ID in order:', order.userId || 'None')
    
    // جميع الطلبات الآن COD فقط
    return res.status(201).json({
      success: true,
      order: {
        id: order._id.toString(),
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
      message: 'تم إنشاء الطلب بنجاح',
    })
    
  } catch (error: any) {
    console.error('Create order error:', error)
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
        field: error.field,
      })
    }
    
    if (error instanceof StockError) {
      return res.status(400).json({
        success: false,
        message: error.message,
        productId: error.productId,
      })
    }
    
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الطلب',
    })
  }
}

/**
 * جلب طلبات المستخدم
 */
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      throw new UnauthorizedError()
    }
    
    const orders = await orderService.getUserOrders(userId)
    
    return res.json({
      success: true,
      orders: orders.map(order => ({
        ...order,
        id: order._id.toString(),
      })),
    })
    
  } catch (error: any) {
    console.error('Get user orders error:', error)
    
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلبات',
    })
  }
}

/**
 * جلب طلب واحد
 */
export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId
    const isAdmin = req.user?.role === 'ADMIN'
    
    // السماح بعرض الطلب بدون authentication (للطلبات الجديدة بعد الدفع)
    // لكن إذا كان هناك userId، نتحقق من الملكية
    const order = await orderService.getOrder(id, isAdmin ? undefined : (userId || undefined))
    
    // إذا كان هناك userId وليس admin، نتحقق من الملكية
    if (userId && !isAdmin && order.userId && order.userId !== userId) {
      throw new UnauthorizedError('غير مصرح لك بعرض هذا الطلب')
    }
    
    return res.json({
      success: true,
      order: {
        ...order,
        id: order._id.toString(),
      },
    })
    
  } catch (error: any) {
    console.error('Get order error:', error)
    
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلب',
    })
  }
}

/**
 * جلب جميع الطلبات (للأدمن)
 */
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📋 getAllOrders called')
    console.log('   User:', req.user)
    console.log('   Role:', req.user?.role)
    
    const isAdmin = req.user?.role === 'ADMIN'
    
    if (!isAdmin) {
      console.log('❌ Not admin - rejecting')
      throw new UnauthorizedError('يتطلب صلاحيات مدير')
    }
    
    console.log('✅ Admin verified - fetching orders')
    const orders = await orderService.getAllOrders()
    console.log(`   Found ${orders.length} orders`)
    
    return res.json({
      success: true,
      orders: orders.map(order => ({
        ...order,
        id: order._id.toString(),
      })),
    })
    
  } catch (error: any) {
    console.error('Get all orders error:', error)
    
    if (error instanceof UnauthorizedError) {
      return res.status(403).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلبات',
    })
  }
}

/**
 * تحديث حالة الطلب (للأدمن)
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status, note, trackingNumber } = req.body
    const isAdmin = req.user?.role === 'ADMIN'
    
    if (!isAdmin) {
      throw new UnauthorizedError('يتطلب صلاحيات مدير')
    }
    
    const order = await orderService.updateOrderStatus(id, status, note, trackingNumber)
    
    return res.json({
      success: true,
      order: {
        ...order,
        id: order._id.toString(),
      },
      message: 'تم تحديث حالة الطلب بنجاح',
    })
    
  } catch (error: any) {
    console.error('Update order status error:', error)
    
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    
    if (error instanceof UnauthorizedError) {
      return res.status(403).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الطلب',
    })
  }
}

/**
 * إلغاء الطلب
 */
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const userId = req.user?.userId
    const isAdmin = req.user?.role === 'ADMIN'
    
    if (!userId) {
      throw new UnauthorizedError()
    }
    
    // التحقق من ملكية الطلب
    if (!isAdmin) {
      const order = await orderService.getOrder(id, userId)
      
      // لا يمكن إلغاء طلب تم شحنه أو توصيله
      if (order.status === 'shipped' || order.status === 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'لا يمكن إلغاء طلب تم شحنه أو توصيله',
        })
      }
    }
    
    const order = await orderService.cancelOrder(id, reason || 'ألغاه العميل')
    
    return res.json({
      success: true,
      order: {
        ...order,
        id: order._id.toString(),
      },
      message: 'تم إلغاء الطلب بنجاح',
    })
    
  } catch (error: any) {
    console.error('Cancel order error:', error)
    
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إلغاء الطلب',
    })
  }
}

/**
 * تأكيد الطلب بعد نجاح الدفع (تحويل من DRAFT إلى confirmed)
 */
export const confirmOrderPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { paymentId } = req.body
    
    console.log(`✅ Confirming order ${id} after successful payment`)
    
    const order = await orderService.confirmOrder(id, paymentId || 'tap_payment')
    
    return res.json({
      success: true,
      order: {
        ...order,
        id: order._id.toString(),
      },
      message: 'تم تأكيد الطلب بنجاح',
    })
    
  } catch (error: any) {
    console.error('Confirm order error:', error)
    
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تأكيد الطلب',
    })
  }
}
