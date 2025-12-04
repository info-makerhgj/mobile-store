import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile-store'

const defaultCategories = [
  {
    name: 'الجوالات',
    slug: 'smartphones',
    icon: '📱',
    order: 1
  },
  {
    name: 'الأجهزة اللوحية',
    slug: 'tablets',
    icon: '📱',
    order: 2
  },
  {
    name: 'الساعات الذكية',
    slug: 'smartwatches',
    icon: '⌚',
    order: 3
  },
  {
    name: 'السماعات',
    slug: 'headphones',
    icon: '🎧',
    order: 4
  }
]

async function setupCategories() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const categoriesCollection = db.collection('categories')
    
    // Check if categories already exist
    const existingCount = await categoriesCollection.countDocuments()
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing categories`)
      console.log('Skipping setup. Delete existing categories first if you want to reset.')
      return
    }
    
    // Insert default categories
    const categoriesToInsert = defaultCategories.map(cat => ({
      ...cat,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    const result = await categoriesCollection.insertMany(categoriesToInsert)
    
    console.log(`✅ Successfully created ${result.insertedCount} categories:`)
    defaultCategories.forEach(cat => {
      console.log(`   - ${cat.icon} ${cat.name} (${cat.slug})`)
    })
    
  } catch (error) {
    console.error('❌ Error setting up categories:', error)
  } finally {
    await client.close()
    console.log('\n✅ Done!')
  }
}

setupCategories()
