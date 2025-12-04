import express from 'express'
import {
  getPaymentMethods,
  getPaymentSettings,
  updatePaymentSettings,
  createTapPayment,
  verifyTapPayment,
  handleTapWebhook,
} from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/adminAuth'

const router = express.Router()

// Public routes
router.get('/methods', getPaymentMethods)

// Tap Payment routes
router.post('/tap/create', authenticate, createTapPayment)
router.get('/tap/verify/:chargeId', verifyTapPayment)
router.post('/tap/webhook', handleTapWebhook)

// Admin routes
router.get('/settings', authenticate, requireAdmin, getPaymentSettings)
router.put('/settings', authenticate, requireAdmin, updatePaymentSettings)

export default router
