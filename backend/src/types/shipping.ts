export interface ShippingProvider {
  id: string;
  name: 'smsa' | 'redbox' | 'aramex';
  displayName: string;
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  apiUrl?: string;
  testMode: boolean;
  settings?: Record<string, any>;
}

export interface ShippingRate {
  id: string;
  providerId: string;
  city: string;
  price: number;
  estimatedDays: number;
}

export interface ShipmentRequest {
  orderId: string;
  providerId: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    weight?: number;
    value: number;
  }>;
  totalValue: number;
  codAmount?: number; // Cash on Delivery
}

export interface ShipmentResponse {
  success: boolean;
  trackingNumber?: string;
  awbNumber?: string;
  estimatedDelivery?: Date;
  cost?: number;
  error?: string;
  rawResponse?: any;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: string;
  statusAr: string;
  currentLocation?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  history: Array<{
    status: string;
    statusAr: string;
    location?: string;
    timestamp: Date;
    notes?: string;
  }>;
}
