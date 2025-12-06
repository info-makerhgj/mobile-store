import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/products'
import authRoutes from './routes/auth'
import orderRoutes from './routes/orders'
import homepageRoutes from './routes/homepage'
import homepageBuilderRoutes from './routes/homepageBuilder'
import paymentRoutes from './routes/payments'
// Payment callbacks removed - COD only
import shippingRoutes from './routes/shipping' // ✅ نظام الشحن
import settingsRoutes from './routes/settings' // ✅ إعدادات المتجر
import addressRoutes from './routes/addresses' // ✅ إدارة العناوين
import customersRoutes from './routes/customers' // ✅ إدارة العملاء
import distributionRoutes from './routes/distribution' // ✅ نظام التوزيع
import pagesRoutes from './routes/pages' // ✅ إدارة الصفحات
import categoryRoutes from './routes/categories' // ✅ إدارة الفئات
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 4000

// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:3000',
  'https://mobile-store-frontend-nu.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true)
    }
    
    // Allow all Vercel domains
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'Mobile Store API - Running ✅' })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/homepage', homepageRoutes)
app.use('/api/homepage-builder', homepageBuilderRoutes)
app.use('/api/payments', paymentRoutes)
// Payment callbacks removed - COD only
app.use('/api/shipping', shippingRoutes) // ✅ نظام الشحن
app.use('/api/settings', settingsRoutes) // ✅ إعدادات المتجر
app.use('/api/addresses', addressRoutes) // ✅ إدارة العناوين
app.use('/api/customers', customersRoutes) // ✅ إدارة العملاء
app.use('/api/distribution', distributionRoutes) // ✅ نظام التوزيع
app.use('/api/pages', pagesRoutes) // ✅ إدارة الصفحات
app.use('/api/categories', categoryRoutes) // ✅ إدارة الفئات
app.use('/api/setup', require('./routes/setup').default) // ✅ Setup route

app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Mobile Store Server running on:`)
  console.log(`   - Local:   http://localhost:${PORT}`)
  console.log(`   - Network: http://0.0.0.0:${PORT}`)
})
