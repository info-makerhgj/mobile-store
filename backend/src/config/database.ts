// 🔧 ملف التكوين المركزي لقاعدة البيانات
// استخدم هذا الملف في كل مكان بدل hardcoded URLs

import dotenv from 'dotenv';

// تحميل .env
dotenv.config();

// MongoDB URL - يستخدم Atlas أولاً، ثم localhost كـ fallback
export const MONGODB_URI = 
  process.env.DATABASE_URL || 
  process.env.MONGODB_URI || 
  'mongodb://localhost:27017/mobile_store';

// Database name
export const DB_NAME = 'mobile_store';

// Helper function للحصول على MongoDB client
import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient && cachedClient.topology?.isConnected()) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  
  console.log('✅ Connected to MongoDB:', MONGODB_URI.includes('mongodb+srv') ? 'Atlas' : 'Local');
  
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

// Helper function لإغلاق الاتصال
export async function closeMongoConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    console.log('✅ MongoDB connection closed');
  }
}
