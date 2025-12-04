import express from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();

// Public routes
router.get('/tax', settingsController.getTaxSettings);
router.get('/shipping', settingsController.getShippingSettings);
router.get('/footer', settingsController.getFooterSettings);

// Admin routes
router.get('/', authenticate, requireAdmin, settingsController.getSettings);
router.put('/', authenticate, requireAdmin, settingsController.updateSettings);
router.put('/tax', authenticate, requireAdmin, settingsController.updateTaxSettings);
router.put('/shipping', authenticate, requireAdmin, settingsController.updateShippingSettings);
router.put('/footer', authenticate, requireAdmin, settingsController.updateFooterSettings);

export default router;
