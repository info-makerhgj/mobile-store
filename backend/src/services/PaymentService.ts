import { MongoClient, ObjectId } from 'mongodb'
import { TapPaymentProvider } from './paymentProviders/TapPaymentProvider'
import { TapPaymentProviderMock } from './paymentProviders/TapPaymentProviderMock'
import { MONGODB_URI } from '../config/database'

const mongoUrl = MONGODB_URI;

export class PaymentService {
  /**
   * جلب إعدادات الدفع
   */
  private async getPaymentSettings() {
    const client = new MongoClient(mongoUrl)
    try {
      await client.connect()
      const db = client.db()
      const settings = await db.collection('PaymentSettings').find({}).toArray()
      
      const config: any = {}
      settings.forEach(setting => {
        config[setting.provider] = {
          enabled: setting.enabled,
          ...setting.config,
        }
      })
      
      return config
    } finally {
      await client.close()
    }
  }

  /**
   * جلب طرق الدفع المتاحة
   */
  async getAvailablePaymentMethods() {
    const settings = await this.getPaymentSettings()
    
    const providerNames: { [key: string]: { name: string; nameAr: string } } = {
      tap: { name: 'Tap Payments', nameAr: 'تاب للدفع' },
      cod: { name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام' },
      tabby: { name: 'Tabby', nameAr: 'تابي' },
      tamara: { name: 'Tamara', nameAr: 'تمارا' },
      myfatoorah: { name: 'MyFatoorah', nameAr: 'ماي فاتورة' },
    }
    
    return Object.keys(settings)
      .filter(provider => settings[provider].enabled)
      .map(provider => ({
        id: provider,
        name: providerNames[provider]?.name || provider,
        nameAr: providerNames[provider]?.nameAr || provider,
        enabled: true,
        config: settings[provider],
      }))
  }

  /**
   * إنشاء عملية دفع عبر Tap
   */
  async createTapPayment(data: {
    orderId: string
    amount: number
    currency: string
    customer: {
      email: string
      phone: string
      name: string
    }
    successUrl: string
    cancelUrl: string
    webhookUrl?: string
  }): Promise<{ paymentUrl: string; chargeId: string }> {
    const settings = await this.getPaymentSettings()
    
    if (!settings.tap?.enabled) {
      throw new Error('Tap Payments غير مفعل')
    }

    // إذا كان Demo Mode مفعل، استخدم Mock Provider
    const isDemoMode = settings.tap.demoMode === 'true' || settings.tap.demoMode === true
    
    let tapProvider: any
    
    if (isDemoMode) {
      console.log('🎭 Using Tap Demo Mode (Mock Provider)')
      tapProvider = new TapPaymentProviderMock()
    } else {
      if (!settings.tap.secretKey || !settings.tap.publicKey) {
        throw new Error('مفاتيح Tap غير مكتملة')
      }
      
      tapProvider = new TapPaymentProvider({
        secretKey: settings.tap.secretKey,
        publicKey: settings.tap.publicKey,
        testMode: settings.tap.testMode === 'true' || settings.tap.testMode === true,
      })
    }

    const result = await tapProvider.createCharge({
      ...data,
      description: `Order #${data.orderId}`,
    })

    // حفظ معلومات الدفع في قاعدة البيانات
    const client = new MongoClient(mongoUrl)
    try {
      await client.connect()
      const db = client.db()
      
      await db.collection('PaymentIntents').insertOne({
        orderId: data.orderId,
        provider: 'tap',
        chargeId: result.chargeId,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        paymentUrl: result.paymentUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } finally {
      await client.close()
    }

    return {
      paymentUrl: result.paymentUrl,
      chargeId: result.chargeId,
    }
  }

  /**
   * التحقق من حالة الدفع عبر Tap
   */
  async verifyTapPayment(chargeId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    orderId?: string
    amount?: number
    currency?: string
  }> {
    const settings = await this.getPaymentSettings()
    
    if (!settings.tap?.enabled) {
      throw new Error('Tap Payments غير مفعل')
    }

    // إذا كان Demo Mode مفعل، استخدم Mock Provider
    const isDemoMode = settings.tap.demoMode === 'true' || settings.tap.demoMode === true
    
    console.log('🎭 Demo Mode Check:', isDemoMode)
    console.log('   Charge ID:', chargeId)
    
    let tapProvider: any
    
    if (isDemoMode) {
      console.log('✅ Using Tap Demo Mode for verification')
      tapProvider = new TapPaymentProviderMock()
    } else {
      console.log('⚠️ Using Real Tap API')
      if (!settings.tap.secretKey || !settings.tap.publicKey) {
        throw new Error('مفاتيح Tap غير مكتملة')
      }
      
      tapProvider = new TapPaymentProvider({
        secretKey: settings.tap.secretKey,
        publicKey: settings.tap.publicKey,
        testMode: settings.tap.testMode === 'true' || settings.tap.testMode === true,
      })
    }

    const result = await tapProvider.getChargeStatus(chargeId)

    // تحديث حالة الدفع في قاعدة البيانات
    const client = new MongoClient(mongoUrl)
    try {
      await client.connect()
      const db = client.db()
      
      const paymentIntent = await db.collection('PaymentIntents').findOne({ chargeId })
      
      if (paymentIntent) {
        await db.collection('PaymentIntents').updateOne(
          { chargeId },
          {
            $set: {
              status: result.status,
              transactionId: result.transactionId,
              updatedAt: new Date(),
            },
          }
        )

        return {
          status: result.status,
          orderId: paymentIntent.orderId,
          amount: result.amount,
          currency: result.currency,
        }
      }

      return { 
        status: result.status,
        amount: result.amount,
        currency: result.currency,
      }
    } finally {
      await client.close()
    }
  }

  /**
   * معالجة Webhook من Tap
   */
  async handleTapWebhook(payload: any): Promise<void> {
    const chargeId = payload.id
    
    if (!chargeId) {
      throw new Error('Invalid webhook payload')
    }

    await this.verifyTapPayment(chargeId)
  }
}

