import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store'

async function initPaymentSettings() {
  const client = new MongoClient(mongoUrl)
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()
    const db = client.db()
    
    console.log('💳 Initializing payment settings...')
    
    const paymentProviders = [
      {
        provider: 'tap',
        enabled: false,
        config: {
          secretKey: '',
          publicKey: '',
          testMode: 'true',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        provider: 'myfatoorah',
        enabled: false,
        config: {
          apiKey: '',
          testMode: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        provider: 'tamara',
        enabled: false,
        config: {
          apiKey: '',
          merchantId: '',
          testMode: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        provider: 'tabby',
        enabled: false,
        config: {
          publicKey: '',
          secretKey: '',
          merchantId: '',
          testMode: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        provider: 'cod',
        enabled: true,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    
    for (const provider of paymentProviders) {
      await db.collection('PaymentSettings').updateOne(
        { provider: provider.provider },
        { $set: provider },
        { upsert: true }
      )
      console.log(`  ✅ ${provider.provider} - ${provider.enabled ? 'Enabled' : 'Disabled'}`)
    }
    
    console.log('\n✅ Payment settings initialized successfully!')
    console.log('\n📝 Summary:')
    console.log('  - Cash on Delivery (COD): Enabled')
    console.log('  - Tap Payment: Disabled (needs API keys)')
    console.log('  - MyFatoorah: Disabled (needs API keys)')
    console.log('  - Tamara: Disabled (needs API keys)')
    console.log('  - Tabby: Disabled (needs API keys)')
    console.log('\n�  You can enable and configure payment providers from Admin Panel')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

initPaymentSettings()
