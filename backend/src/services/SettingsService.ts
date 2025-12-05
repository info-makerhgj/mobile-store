import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsService {
  async getSetting(key: string): Promise<any> {
    const setting = await prisma.storeSettings.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  async setSetting(key: string, value: any): Promise<any> {
    return await prisma.storeSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
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
    const settings = await prisma.storeSettings.findMany();
    const result: any = {};
    settings.forEach((s: any) => {
      result[s.key] = s.value;
    });
    return result;
  }
}
