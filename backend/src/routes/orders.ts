import { Router } from 'express'
import {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  confirmOrderPayment,
} from '../controllers/orderController'
import { authenticate, optionalAuth } from '../middleware/auth'
import { requireAdmin } from '../middleware/adminAuth'

const router = Router()

// Admin routes (يجب أن تكون قبل الـ dynamic routes)
router.get('/admin/all', authenticate, requireAdmin, getAllOrders)
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus)

// Customer routes
router.post('/', optionalAuth, createOrder) // يسمح بالطلبات بدون تسجيل دخول
router.get('/my-orders', authenticate, getUserOrders) // يتطلب تسجيل دخول
router.get('/:id', optionalAuth, getOrder) // يسمح بعرض الطلب بدون تسجيل دخول
router.post('/:id/cancel', authenticate, cancelOrder) // يتطلب تسجيل دخول
router.post('/:id/confirm', optionalAuth, confirmOrderPayment) // تأكيد الطلب بعد نجاح الدفع

export default router
