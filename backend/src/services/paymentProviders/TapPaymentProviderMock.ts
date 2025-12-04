/**
 * Tap Payment Provider - Demo/Mock Mode
 * يستخدم للتجربة بدون مفاتيح حقيقية
 */

export class TapPaymentProviderMock {
  /**
   * إنشاء عملية دفع وهمية (Demo)
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
    
    // إنشاء معرف وهمي
    const chargeId = `chg_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // إنشاء رابط دفع وهمي (يوجه لصفحة تجريبية)
    const demoPaymentUrl = `http://localhost:3000/demo-payment?` +
      `chargeId=${chargeId}&` +
      `amount=${data.amount}&` +
      `currency=${data.currency}&` +
      `orderId=${data.orderId}&` +
      `successUrl=${encodeURIComponent(data.successUrl)}&` +
      `cancelUrl=${encodeURIComponent(data.cancelUrl)}`
    
    console.log('🎭 Demo Mode: Created mock payment')
    console.log('   Charge ID:', chargeId)
    console.log('   Amount:', data.amount, data.currency)
    console.log('   Order ID:', data.orderId)
    
    return {
      chargeId,
      paymentUrl: demoPaymentUrl,
    }
  }

  /**
   * التحقق من حالة الدفع الوهمي
   */
  async getChargeStatus(chargeId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    transactionId?: string
    amount?: number
    currency?: string
  }> {
    
    console.log('🎭🎭🎭 MOCK PROVIDER: Checking payment status')
    console.log('   Charge ID:', chargeId)
    console.log('   This is the MOCK provider, not the real one!')
    
    // في الوضع التجريبي، نعتبر كل الدفعات ناجحة
    return {
      status: 'completed',
      transactionId: chargeId,
      amount: 100,
      currency: 'SAR',
    }
  }

  /**
   * استرجاع المبلغ (وهمي)
   */
  async refundCharge(chargeId: string, amount?: number): Promise<{
    refundId: string
    status: string
  }> {
    
    const refundId = `rfnd_demo_${Date.now()}`
    
    console.log('🎭 Demo Mode: Created mock refund')
    console.log('   Refund ID:', refundId)
    console.log('   Charge ID:', chargeId)
    console.log('   Amount:', amount)
    
    return {
      refundId,
      status: 'succeeded',
    }
  }

  /**
   * التحقق من Webhook (وهمي)
   */
  verifyWebhook(payload: any, signature: string): boolean {
    console.log('🎭 Demo Mode: Webhook verification (always true)')
    return true
  }
}
