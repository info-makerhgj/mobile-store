import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', authenticate, authorize(['admin']), createProduct)
router.put('/:id', authenticate, authorize(['admin']), updateProduct)
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct)

export default router
