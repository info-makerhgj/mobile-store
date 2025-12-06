import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';
import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '../config/database'

const settingsService = new SettingsService();
const mongoUrl = MONGODB_URI;;

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getAllSettings();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    await settingsService.setSetting(key, value);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTaxSettings = async (req: Request, res: Response) => {
  try {
    const rate = await settingsService.getTaxRate();
    const enabled = await settingsService.isTaxEnabled();
    res.json({ success: true, tax: { rate, enabled } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTaxSettings = async (req: Request, res: Response) => {
  try {
    const { rate, enabled } = req.body;
    await settingsService.setSetting('tax_rate', { rate, enabled });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getShippingSettings = async (req: Request, res: Response) => {
  try {
    const threshold = await settingsService.getFreeShippingThreshold();
    res.json({ success: true, shipping: { freeShippingThreshold: threshold } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateShippingSettings = async (req: Request, res: Response) => {
  try {
    const { freeShippingThreshold } = req.body;
    await settingsService.setFreeShippingThreshold(freeShippingThreshold);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFooterSettings = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    
    const setting = await db.collection('Settings').findOne({ key: 'footer' });
    const footer = setting?.value || getDefaultFooterSettings();
    
    res.json({ success: true, footer });
  } catch (error: any) {
    console.error('Get footer settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

export const updateFooterSettings = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    
    const footerData = req.body;
    
    await db.collection('Settings').updateOne(
      { key: 'footer' },
      { $set: { key: 'footer', value: footerData, updatedAt: new Date() } },
      { upsert: true }
    );
    
    console.log('✅ Footer settings updated');
    res.json({ success: true });
  } catch (error: any) {
    console.error('Update footer settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

function getDefaultFooterSettings() {
  return {
    brandName: 'أبعاد التواصل',
    brandTagline: 'أبعاد جديدة للتواصل التقني',
    brandDescription: 'متجرك الموثوق لأحدث الجوالات والإكسسوارات الأصلية',
    phone: '+966 50 123 4567',
    email: 'info@abaad.sa',
    socialMedia: {
      instagram: '#',
      twitter: '#',
      facebook: '#'
    },
    quickLinks: [
      { title: 'من نحن', url: '/about' },
      { title: 'المنتجات', url: '/products' },
      { title: 'العروض', url: '/offers' },
      { title: 'تواصل معنا', url: '/contact' }
    ],
    supportLinks: [
      { title: 'سياسة الضمان', url: '/warranty' },
      { title: 'سياسة الإرجاع', url: '/return' },
      { title: 'الخصوصية', url: '/privacy' },
      { title: 'الشروط', url: '/terms' }
    ],
    copyright: '© 2025 أبعاد التواصل. جميع الحقوق محفوظة',
    features: [
      { icon: '🇸🇦', text: 'السعودية' },
      { icon: '💳', text: 'دفع آمن' },
      { icon: '🚚', text: 'شحن سريع' }
    ]
  };
}

