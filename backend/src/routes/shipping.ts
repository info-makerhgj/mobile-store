import express from 'express';
import * as shippingController from '../controllers/shippingController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();

// Public routes
router.get('/providers/enabled', shippingController.getEnabledProviders);
router.get('/rates', shippingController.getShippingRates);
router.get('/track/:trackingNumber', shippingController.trackShipment);

// Protected routes (require authentication)
router.post('/shipments', authenticate, shippingController.createShipment);

// Admin routes
router.get('/providers', authenticate, requireAdmin, shippingController.getProviders);
router.put('/providers/:id', authenticate, requireAdmin, shippingController.updateProvider);
router.post('/rates', authenticate, requireAdmin, shippingController.createShippingRate);
router.put('/rates/:id', authenticate, requireAdmin, shippingController.updateShippingRate);
router.delete('/rates/:id', authenticate, requireAdmin, shippingController.deleteShippingRate);

export default router;
