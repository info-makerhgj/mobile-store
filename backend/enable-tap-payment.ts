import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store'

async function enableTapPayment() {
  const client = new MongoClient(mongoUrl)
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()
    const db = client.db()
    
    console.log('💳 Enabling Tap Payments...')
    
    // تحديث إعدادات Tap
    await db.collection('PaymentSettings').updateOne(
      { provider: 'tap' },
      {
        $set: {
          provider: 'tap',
          enabled: true,
          config: {
            secretKey: process.env.TAP_SECRET_KEY || '',
            publicKey: process.env.TAP_PUBLIC_KEY || '',
            testMode: 'true',
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
    
    console.log('\n✅ Tap Payments enabled successfully!')
    console.log('\n📝 Next Steps:')
    console.log('  1. Go to Admin Panel → Settings → Payment Settings')
    console.log('  2. Enter your Tap API Keys:')
    console.log('     - Secret Key (sk_test_... or sk_live_...)')
    console.log('     - Public Key (pk_test_... or pk_live_...)')
    console.log('  3. Choose Test Mode or Live Mode')
    console.log('  4. Save changes')
    console.log('\n💡 Get your API keys from: https://www.tap.company/ar-sa')
    console.log('\n🧪 Test Cards:')
    console.log('  Success: 4242 4242 4242 4242')
    console.log('  Decline: 4000 0000 0000 0002')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

enableTapPayment()
