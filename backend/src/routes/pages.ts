import { Router } from 'express';
import { getPage, getAllPages, updatePage } from '../controllers/pagesController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Public routes
router.get('/:slug', getPage);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllPages);
router.put('/:slug', authenticate, requireAdmin, updatePage);

export default router;
