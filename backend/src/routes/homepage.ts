import { Router } from 'express'
import {
  getHomepageConfig,
  updateHomepageConfig,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  duplicateSection,
  toggleSection,
  getFeaturedDealsSettings,
  updateFeaturedDealsSettings,
  getExclusiveOffersSettings,
  updateExclusiveOffersSettings,
} from '../controllers/homepageController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public route - get homepage config
router.get('/', getHomepageConfig)

// Featured Deals Settings
router.get('/featured-deals', getFeaturedDealsSettings)
router.put('/featured-deals', authenticate, authorize(['admin']), updateFeaturedDealsSettings)

// Exclusive Offers Settings
router.get('/exclusive-offers', getExclusiveOffersSettings)
router.put('/exclusive-offers', authenticate, authorize(['admin']), updateExclusiveOffersSettings)

// Admin routes - manage homepage
router.put('/', authenticate, authorize(['admin']), updateHomepageConfig)

// Sections Management
router.post('/sections', authenticate, authorize(['admin']), addSection)
router.put('/sections/:sectionId', authenticate, authorize(['admin']), updateSection)
router.delete('/sections/:sectionId', authenticate, authorize(['admin']), deleteSection)
router.post('/sections/reorder', authenticate, authorize(['admin']), reorderSections)
router.post('/sections/:sectionId/duplicate', authenticate, authorize(['admin']), duplicateSection)
router.post('/sections/:sectionId/toggle', authenticate, authorize(['admin']), toggleSection)

export default router
