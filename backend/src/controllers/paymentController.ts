import { Request, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import { AuthRequest } from '../middleware/auth'
import { PaymentService } from '../services/PaymentService'

const mongoUrl = MONGODB_URI;
const paymentService = new PaymentService()

/**
 * جلب طرق الدفع المتاحة
 */
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const methods = await paymentService.getAvailablePaymentMethods()
    
    const methodsWithLogos = methods.map(method => ({
      ...method,
      logo: method.id === 'tap' ? '💳' : method.id === 'cod' ? '📦' : '💰',
      type: method.id === 'cod' ? 'cod' : 'online',
    }))
    
    res.json({ success: true, methods: methodsWithLogos })
  } catch (error) {
    console.error('Get payment methods error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  }
}

/**
 * جلب إعدادات الدفع (للأدمن)
 */
export const getPaymentSettings = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl)
  
  try {
    const isAdmin = req.user?.role === 'ADMIN'
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'غير مصرح' })
    }
    
    await client.connect()
    const db = client.db()
    
    const settingsArray = await db.collection('PaymentSettings').find({}).toArray()
    
    const settings: any = {}
    settingsArray.forEach((setting: any) => {
      settings[setting.provider] = {
        enabled: setting.enabled || false,
        config: setting.config || {}
      }
    })
    
    res.json({ success: true, settings })
  } catch (error) {
    console.error('Get payment settings error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  } finally {
    await client.close()
  }
}

/**
 * تحديث إعدادات الدفع (للأدمن)
 */
export const updatePaymentSettings = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl)
  
  try {
    const isAdmin = req.user?.role === 'ADMIN'
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'غير مصرح' })
    }
    
    const { provider, enabled, config } = req.body
    
    await client.connect()
    const db = client.db()
    
    await db.collection('PaymentSettings').updateOne(
      { provider },
      {
        $set: {
          enabled,
          config,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
    
    res.json({ success: true, message: 'تم تحديث إعدادات الدفع بنجاح' })
  } catch (error) {
    console.error('Update payment settings error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  } finally {
    await client.close()
  }
}

/**
 * إنشاء عملية دفع عبر Tap
 */
export const createTapPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency = 'SAR', customerName, customerEmail, customerPhone } = req.body
    
    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'المبلغ مطلوب' 
      })
    }

    const userId = req.user?.userId
    
    // جلب بيانات العميل
    let customer = {
      email: customerEmail || 'customer@example.com',
      phone: customerPhone || '0500000000',
      name: customerName || 'Customer',
    }
    
    // إذا كان المستخدم مسجل دخول، نستخدم بياناته
    if (userId) {
      const client = new MongoClient(mongoUrl)
      try {
        await client.connect()
        const db = client.db()
        
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) })
        if (user) {
          customer = {
            email: user.email || customer.email,
            phone: user.phone || customer.phone,
            name: user.name || customer.name,
          }
        }
      } finally {
        await client.close()
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    
    // إنشاء معرف مؤقت للدفع
    const tempPaymentId = `temp_${Date.now()}`
    
    const result = await paymentService.createTapPayment({
      orderId: tempPaymentId,
      amount,
      currency,
      customer,
      successUrl: `${frontendUrl}/payment/callback`,
      cancelUrl: `${frontendUrl}/checkout`,
      webhookUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/tap/webhook`,
    })

    res.json({ 
      success: true, 
      paymentUrl: result.paymentUrl,
      chargeId: result.chargeId,
    })
  } catch (error: any) {
    console.error('Create Tap payment error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'حدث خطأ في إنشاء عملية الدفع' 
    })
  }
}

/**
 * التحقق من حالة الدفع عبر Tap
 */
export const verifyTapPayment = async (req: Request, res: Response) => {
  try {
    const { chargeId } = req.params
    
    console.log('🔍 Verifying Tap payment:', chargeId)
    
    if (!chargeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف الدفع مطلوب' 
      })
    }

    const result = await paymentService.verifyTapPayment(chargeId)
    
    console.log('📊 Payment verification result:', result)
    console.log('   Status:', result.status)
    console.log('   Order ID:', result.orderId)

    // تحديث حالة الطلب إذا كان الدفع ناجحاً
    if (result.status === 'completed' && result.orderId) {
      const client = new MongoClient(mongoUrl)
      try {
        await client.connect()
        const db = client.db()
        
        // البحث بـ orderNumber أو _id
        const query = ObjectId.isValid(result.orderId) 
          ? { _id: new ObjectId(result.orderId) }
          : { orderNumber: result.orderId }
        
        await db.collection('Order').updateOne(
          query,
          {
            $set: {
              paymentStatus: 'paid',
              status: 'processing',
              updatedAt: new Date(),
            },
          }
        )
        
        console.log('✅ Order updated to paid status')
      } finally {
        await client.close()
      }
    } else if (result.status === 'failed' || result.status === 'cancelled') {
      console.log('❌ Payment failed or cancelled')
    }

    res.json({ 
      success: result.status === 'completed', 
      status: result.status,
      orderId: result.orderId,
      amount: result.amount,
    })
  } catch (error: any) {
    console.error('❌ Verify Tap payment error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'حدث خطأ في التحقق من الدفع' 
    })
  }
}

/**
 * معالجة Webhook من Tap
 */
export const handleTapWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body
    
    await paymentService.handleTapWebhook(payload)
    
    res.json({ success: true })
  } catch (error: any) {
    console.error('Tap webhook error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'حدث خطأ في معالجة Webhook' 
    })
  }
}
