import axios from 'axios'

interface TapConfig {
  secretKey: string
  publicKey: string
  testMode: boolean
}

interface TapChargeRequest {
  amount: number
  currency: string
  customer: {
    email: string
    phone: {
      country_code: string
      number: string
    }
    first_name: string
    last_name?: string
  }
  source: {
    id: string
  }
  redirect: {
    url: string
  }
  post?: {
    url: string
  }
  metadata?: {
    orderId: string
    [key: string]: any
  }
  description?: string
}

interface TapChargeResponse {
  id: string
  status: string
  amount: number
  currency: string
  transaction?: {
    url: string
  }
  redirect?: {
    url: string
  }
}

export class TapPaymentProvider {
  private config: TapConfig
  private baseUrl: string

  constructor(config: TapConfig) {
    this.config = config
    this.baseUrl = config.testMode 
      ? 'https://api.tap.company/v2' 
      : 'https://api.tap.company/v2'
  }

  /**
   * إنشاء عملية دفع جديدة
   */
  async createCharge(data: {
    amount: number
    currency: string
    orderId: string
    customer: {
      email: string
      phone: string
      name: string
    }
    successUrl: string
    cancelUrl: string
    webhookUrl?: string
    description?: string
  }): Promise<{ chargeId: string; paymentUrl: string }> {
    try {
      // تقسيم الاسم إلى first_name و last_name
      const nameParts = data.customer.name.split(' ')
      const firstName = nameParts[0] || 'Customer'
      const lastName = nameParts.slice(1).join(' ') || ''

      // تنظيف رقم الهاتف
      let phoneNumber = data.customer.phone.replace(/\D/g, '')
      let countryCode = '966' // السعودية افتراضياً
      
      if (phoneNumber.startsWith('966')) {
        phoneNumber = phoneNumber.substring(3)
      } else if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1)
      }

      const chargeRequest: TapChargeRequest = {
        amount: data.amount,
        currency: data.currency,
        customer: {
          email: data.customer.email,
          phone: {
            country_code: countryCode,
            number: phoneNumber,
          },
          first_name: firstName,
          last_name: lastName,
        },
        source: {
          id: 'src_all', // يسمح بجميع طرق الدفع
        },
        redirect: {
          url: data.successUrl,
        },
        metadata: {
          orderId: data.orderId,
        },
        description: data.description || `Order #${data.orderId}`,
      }

      // إضافة webhook إذا كان متوفراً
      if (data.webhookUrl) {
        chargeRequest.post = {
          url: data.webhookUrl,
        }
      }

      const response = await axios.post<TapChargeResponse>(
        `${this.baseUrl}/charges`,
        chargeRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const charge = response.data

      return {
        chargeId: charge.id,
        paymentUrl: charge.transaction?.url || charge.redirect?.url || '',
      }
    } catch (error: any) {
      console.error('Tap Payment Error:', error.response?.data || error.message)
      throw new Error(
        error.response?.data?.message || 
        'فشل في إنشاء عملية الدفع عبر Tap'
      )
    }
  }

  /**
   * التحقق من حالة الدفع
   */
  async getChargeStatus(chargeId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    transactionId?: string
    amount?: number
    currency?: string
  }> {
    try {
      console.log('⚠️⚠️⚠️ REAL TAP PROVIDER: Making API call to Tap')
      console.log('   Charge ID:', chargeId)
      console.log('   This should NOT happen in demo mode!')
      
      const response = await axios.get<TapChargeResponse>(
        `${this.baseUrl}/charges/${chargeId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
          },
        }
      )

      const charge = response.data
      let status: 'pending' | 'completed' | 'failed' | 'cancelled' = 'pending'

      // تحويل حالة Tap إلى حالة النظام
      switch (charge.status) {
        case 'CAPTURED':
        case 'AUTHORIZED':
          status = 'completed'
          break
        case 'FAILED':
          status = 'failed'
          break
        case 'CANCELLED':
        case 'VOID':
          status = 'cancelled'
          break
        default:
          status = 'pending'
      }

      return {
        status,
        transactionId: charge.id,
        amount: charge.amount,
        currency: charge.currency,
      }
    } catch (error: any) {
      console.error('Tap Get Status Error:', error.response?.data || error.message)
      throw new Error('فشل في جلب حالة الدفع من Tap')
    }
  }

  /**
   * استرجاع المبلغ (Refund)
   */
  async refundCharge(chargeId: string, amount?: number): Promise<{
    refundId: string
    status: string
  }> {
    try {
      const refundData: any = {
        charge_id: chargeId,
      }

      if (amount) {
        refundData.amount = amount
      }

      const response = await axios.post(
        `${this.baseUrl}/refunds`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        refundId: response.data.id,
        status: response.data.status,
      }
    } catch (error: any) {
      console.error('Tap Refund Error:', error.response?.data || error.message)
      throw new Error('فشل في استرجاع المبلغ من Tap')
    }
  }

  /**
   * التحقق من صحة Webhook
   */
  verifyWebhook(payload: any, signature: string): boolean {
    // TODO: تنفيذ التحقق من التوقيع
    // Tap يرسل x-tap-signature في الـ headers
    return true
  }
}
