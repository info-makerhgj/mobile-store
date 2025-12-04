export class ValidationError extends Error {
  field?: string
  
  constructor(message: string, field?: string) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

export class PaymentError extends Error {
  code?: string
  
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'PaymentError'
    this.code = code
  }
}

export class StockError extends Error {
  productId?: string
  
  constructor(message: string, productId?: string) {
    super(message)
    this.name = 'StockError'
    this.productId = productId
  }
}

export class OrderNotFoundError extends Error {
  constructor(orderId: string) {
    super(`الطلب ${orderId} غير موجود`)
    this.name = 'OrderNotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'غير مصرح') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
