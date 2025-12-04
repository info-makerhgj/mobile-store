import { Request, Response } from 'express';
import { ShippingService } from '../services/ShippingService';

const shippingService = new ShippingService();

export const getProviders = async (req: Request, res: Response) => {
  try {
    const providers = await shippingService.getAllProviders();
    res.json({ success: true, providers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEnabledProviders = async (req: Request, res: Response) => {
  try {
    const providers = await shippingService.getEnabledProviders();
    res.json({ success: true, providers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const provider = await shippingService.updateProvider(id, req.body);
    res.json({ success: true, provider });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ success: false, error: 'المدينة مطلوبة' });
    }
    const rates = await shippingService.getShippingRates(city as string);
    res.json({ success: true, rates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const result = await shippingService.createShipment(req.body);
    if (result.success) {
      res.json({ success: true, shipment: result });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const trackShipment = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;
    const tracking = await shippingService.trackShipment(trackingNumber);
    if (tracking) {
      res.json({ success: true, tracking });
    } else {
      res.status(404).json({ success: false, error: 'الشحنة غير موجودة' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createShippingRate = async (req: Request, res: Response) => {
  try {
    const rate = await shippingService.createShippingRate(req.body);
    res.json({ success: true, rate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateShippingRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rate = await shippingService.updateShippingRate(id, req.body);
    res.json({ success: true, rate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteShippingRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await shippingService.deleteShippingRate(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
