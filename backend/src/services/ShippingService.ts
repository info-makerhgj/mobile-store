import { MongoClient, ObjectId } from 'mongodb';
import { ShipmentRequest, ShipmentResponse, TrackingInfo, ShippingProvider } from '../types/shipping';
import { SmsaService } from './shippingProviders/SmsaService';
import { RedboxService } from './shippingProviders/RedboxService';
import { AramexService } from './shippingProviders/AramexService';
import { MONGODB_URI } from '../config/database'

const mongoUrl = MONGODB_URI;;

export class ShippingService {
  async getEnabledProviders(): Promise<ShippingProvider[]> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      const providers = await db.collection('shipping_providers').find({ enabled: true }).toArray();

      return providers.map((p: any) => ({
        id: p._id.toString(),
        name: p.name as 'smsa' | 'redbox' | 'aramex',
        displayName: p.displayName,
        enabled: p.enabled,
        testMode: p.testMode,
      }));
    } finally {
      await client.close();
    }
  }

  async getAllProviders(): Promise<any[]> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      const providers = await db.collection('shipping_providers').find().toArray();
      return providers.map((p: any) => ({ ...p, id: p._id.toString() }));
    } finally {
      await client.close();
    }
  }

  async getProvider(providerId: string): Promise<any> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      const provider = await db.collection('shipping_providers').findOne({ _id: new ObjectId(providerId) });
      if (provider) {
        return { ...provider, id: provider._id.toString() };
      }
      return null;
    } finally {
      await client.close();
    }
  }

  async updateProvider(providerId: string, data: any): Promise<any> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      
      const updateData = { ...data };
      delete updateData.id;
      updateData.updatedAt = new Date();

      await db.collection('shipping_providers').updateOne(
        { _id: new ObjectId(providerId) },
        { $set: updateData }
      );

      return await this.getProvider(providerId);
    } finally {
      await client.close();
    }
  }

  async updateProviderPrices(providerId: string, price?: number, days?: number): Promise<void> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      
      const updateData: any = { updatedAt: new Date() };
      if (price !== undefined) updateData.price = price;
      if (days !== undefined) updateData.estimatedDays = days;
      
      // تحديث جميع أسعار المدن لهذه الشركة
      await db.collection('shipping_rates').updateMany(
        { providerId: new ObjectId(providerId) },
        { $set: updateData }
      );
      
      // تحديث السعر الافتراضي في معلومات الشركة
      const providerUpdate: any = { updatedAt: new Date() };
      if (price !== undefined) providerUpdate.defaultPrice = price;
      if (days !== undefined) providerUpdate.defaultDays = days;
      
      await db.collection('shipping_providers').updateOne(
        { _id: new ObjectId(providerId) },
        { $set: providerUpdate }
      );
      
      console.log(`✅ تم تحديث أسعار جميع المدن للشركة ${providerId}`);
    } finally {
      await client.close();
    }
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    const provider = await this.getProvider(request.providerId);
    
    if (!provider || !provider.enabled) {
      return {
        success: false,
        error: 'مزود الشحن غير متاح',
      };
    }

    let service;
    switch (provider.name) {
      case 'smsa':
        service = new SmsaService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      case 'redbox':
        service = new RedboxService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      case 'aramex':
        service = new AramexService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          accountNumber: provider.settings?.accountNumber,
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      default:
        return {
          success: false,
          error: 'مزود شحن غير معروف',
        };
    }

    const result = await service.createShipment(request);

    // حفظ معلومات الشحنة في قاعدة البيانات
    if (result.success && result.trackingNumber) {
      const client = new MongoClient(mongoUrl);
      try {
        await client.connect();
        const db = client.db();
        await db.collection('shipments').insertOne({
          orderId: request.orderId,
          providerId: new ObjectId(request.providerId),
          trackingNumber: result.trackingNumber,
          status: 'pending',
          shippingCost: result.cost || 0,
          estimatedDelivery: result.estimatedDelivery,
          apiResponse: result.rawResponse,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } finally {
        await client.close();
      }
    }

    return result;
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo | null> {
    const client = new MongoClient(mongoUrl);
    let shipment;
    
    try {
      await client.connect();
      const db = client.db();
      shipment = await db.collection('shipments').findOne({ trackingNumber });
    } finally {
      await client.close();
    }

    if (!shipment) {
      return null;
    }

    const provider = await this.getProvider(shipment.providerId.toString());
    if (!provider) {
      return null;
    }

    let service;
    switch (provider.name) {
      case 'smsa':
        service = new SmsaService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      case 'redbox':
        service = new RedboxService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      case 'aramex':
        service = new AramexService({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          accountNumber: provider.settings?.accountNumber,
          apiUrl: provider.apiUrl,
          testMode: provider.testMode,
        });
        break;
      default:
        return null;
    }

    const tracking = await service.trackShipment(trackingNumber);

    // تحديث حالة الشحنة
    if (tracking) {
      const client = new MongoClient(mongoUrl);
      try {
        await client.connect();
        const db = client.db();
        await db.collection('shipments').updateOne(
          { _id: shipment._id },
          { 
            $set: { 
              status: tracking.status,
              actualDelivery: tracking.actualDelivery,
              updatedAt: new Date(),
            } 
          }
        );
      } finally {
        await client.close();
      }
    }

    return tracking;
  }

  async getShippingRates(city: string): Promise<any[]> {
    const client = new MongoClient(mongoUrl);
    let rates;
    
    try {
      await client.connect();
      const db = client.db();
      
      // البحث عن أسعار المدينة المحددة
      rates = await db.collection('shipping_rates').find({ city }).toArray();
    } finally {
      await client.close();
    }

    // جلب الشركات المفعلة فقط
    const providers = await this.getEnabledProviders();
    
    // تصفية الأسعار للشركات المفعلة فقط
    return rates
      .filter((rate: any) => providers.some(p => p.id === rate.providerId.toString()))
      .map((rate: any) => {
        const provider = providers.find(p => p.id === rate.providerId.toString());
        return {
          providerId: rate.providerId.toString(),
          providerName: provider?.displayName,
          price: rate.price,
          estimatedDays: rate.estimatedDays,
        };
      });
  }

  async updateShippingRate(rateId: string, data: any): Promise<any> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      await db.collection('shipping_rates').updateOne(
        { _id: new ObjectId(rateId) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await db.collection('shipping_rates').findOne({ _id: new ObjectId(rateId) });
    } finally {
      await client.close();
    }
  }

  async createShippingRate(data: any): Promise<any> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      const result = await db.collection('shipping_rates').insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await db.collection('shipping_rates').findOne({ _id: result.insertedId });
    } finally {
      await client.close();
    }
  }

  async deleteShippingRate(rateId: string): Promise<void> {
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db();
      await db.collection('shipping_rates').deleteOne({ _id: new ObjectId(rateId) });
    } finally {
      await client.close();
    }
  }
}

