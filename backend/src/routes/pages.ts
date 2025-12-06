import { Router } from 'express';
import { getPage, getAllPages, updatePage } from '../controllers/pagesController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Admin routes (يجب أن تكون قبل /:slug)
router.get('/', authenticate, requireAdmin, getAllPages);
router.put('/:slug', authenticate, requireAdmin, updatePage);

// Public routes
router.get('/:slug', getPage);

export default router;
