export interface PaymentProvider {
  id: string
  name: string
  nameAr: string
  nameEn: string
  logo: string
  enabled: boolean
  type: 'card' | 'bnpl' | 'wallet'
}

export interface PaymentConfig {
  tap: {
    enabled: boolean
    secretKey: string
    publicKey: string
    webhookSecret: string
  }
  tabby: {
    enabled: boolean
    secretKey: string
    publicKey: string
    merchantCode: string
  }
  tamara: {
    enabled: boolean
    apiToken: string
    merchantUrl: string
    notificationToken: string
  }
  myfatoorah: {
    enabled: boolean
    apiKey: string
    baseUrl: string
  }
}

export interface PaymentIntent {
  id: string
  orderId: string
  amount: number
  currency: string
  provider: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  paymentUrl?: string
  transactionId?: string
  metadata?: any
  createdAt: Date
  updatedAt: Date
}

export interface TapPaymentRequest {
  amount: number
  currency: string
  customer: {
    email: string
    phone: string
    name: string
  }
  source: {
    id: string
  }
  redirect: {
    url: string
  }
  metadata: {
    orderId: string
  }
}

export interface TabbySession {
  payment: {
    amount: string
    currency: string
    buyer: {
      email: string
      phone: string
      name: string
    }
    order: {
      reference_id: string
      items: Array<{
        title: string
        quantity: number
        unit_price: string
        category: string
      }>
    }
    shipping_address: {
      city: string
      address: string
      zip: string
    }
  }
  lang: string
  merchant_code: string
  merchant_urls: {
    success: string
    cancel: string
    failure: string
  }
}

export interface TamaraCheckout {
  order_reference_id: string
  total_amount: {
    amount: number
    currency: string
  }
  description: string
  country_code: string
  payment_type: string
  locale: string
  items: Array<{
    name: string
    type: string
    reference_id: string
    sku: string
    quantity: number
    unit_price: {
      amount: number
      currency: string
    }
    total_amount: {
      amount: number
      currency: string
    }
  }>
  consumer: {
    email: string
    phone_number: string
    first_name: string
    last_name: string
  }
  shipping_address: {
    city: string
    country_code: string
    first_name: string
    last_name: string
    line1: string
    phone_number: string
  }
  merchant_url: {
    success: string
    failure: string
    cancel: string
    notification: string
  }
}
