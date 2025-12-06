import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

export class SettingsService {
  async getSetting(key: string): Promise<any> {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const setting = await db.collection('storeSettings').findOne({ key });
      return setting?.value || null;
    } finally {
      await client.close();
    }
  }

  async setSetting(key: string, value: any): Promise<any> {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const result = await db.collection('storeSettings').updateOne(
        { key },
        { $set: { key, value, updatedAt: new Date() } },
        { upsert: true }
      );
      return { key, value };
    } finally {
      await client.close();
    }
  }

  async getTaxRate(): Promise<number> {
    const setting = await this.getSetting('tax_rate');
    return setting?.rate || 0.15; // 15% افتراضياً
  }

  async setTaxRate(rate: number): Promise<void> {
    await this.setSetting('tax_rate', { rate, enabled: true });
  }

  async isTaxEnabled(): Promise<boolean> {
    const setting = await this.getSetting('tax_rate');
    return setting?.enabled !== false;
  }

  async getFreeShippingThreshold(): Promise<number> {
    const setting = await this.getSetting('free_shipping_threshold');
    return setting?.amount || 0;
  }

  async setFreeShippingThreshold(amount: number): Promise<void> {
    await this.setSetting('free_shipping_threshold', { amount, enabled: amount > 0 });
  }

  async getAllSettings(): Promise<any> {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const settings = await db.collection('storeSettings').find({}).toArray();
      const result: any = {};
      settings.forEach((s: any) => {
        result[s.key] = s.value;
      });
      return result;
    } finally {
      await client.close();
    }
  }
}
