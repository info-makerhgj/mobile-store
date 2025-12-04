import express from 'express'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController'
import { requireAdmin } from '../middleware/adminAuth'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Public routes
router.get('/', getCategories)
router.get('/:slug', getCategory)

// Admin routes
router.post('/', authenticate, requireAdmin, createCategory)
router.put('/:id', authenticate, requireAdmin, updateCategory)
router.delete('/:id', authenticate, requireAdmin, deleteCategory)

export default router
