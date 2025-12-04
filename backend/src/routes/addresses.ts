import express from 'express';
import * as addressController from '../controllers/addressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// جميع المسارات تتطلب تسجيل دخول
router.get('/', authenticate, addressController.getAddresses);
router.post('/', authenticate, addressController.createAddress);
router.put('/:id', authenticate, addressController.updateAddress);
router.delete('/:id', authenticate, addressController.deleteAddress);
router.put('/:id/default', authenticate, addressController.setDefaultAddress);

export default router;
