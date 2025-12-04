import { Router } from 'express'
import { saveHomepageSections, uploadImage } from '../controllers/homepageBuilderController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Save homepage sections
router.post('/save', authenticate, authorize(['admin']), saveHomepageSections)

// Upload image
router.post('/upload-image', authenticate, authorize(['admin']), uploadImage)

export default router
