import { ShipmentRequest, ShipmentResponse, TrackingInfo } from '../../types/shipping';

export class RedboxService {
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;
  private testMode: boolean;

  constructor(config: { apiKey: string; apiSecret: string; apiUrl?: string; testMode?: boolean }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.apiUrl = config.apiUrl || 'https://api.redboxsa.com/v1';
    this.testMode = config.testMode || false;
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    try {
      if (this.testMode) {
        return this.createTestShipment(request);
      }

      // Redbox API Integration
      const payload = {
        api_key: this.apiKey,
        order_reference: request.orderId,
        customer: {
          name: request.customerInfo.name,
          phone: request.customerInfo.phone,
          email: request.customerInfo.email,
          address: {
            street: request.customerInfo.address,
            city: request.customerInfo.city,
            postal_code: request.customerInfo.postalCode,
            country: 'SA',
          },
        },
        items: request.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          weight: item.weight || 1,
          value: item.value,
        })),
        payment: {
          method: request.codAmount ? 'cod' : 'prepaid',
          amount: request.codAmount || 0,
        },
        total_value: request.totalValue,
      };

      const response = await fetch(`${this.apiUrl}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (data.success && data.shipment) {
        return {
          success: true,
          trackingNumber: data.shipment.tracking_number,
          awbNumber: data.shipment.awb_number,
          estimatedDelivery: data.shipment.estimated_delivery ? new Date(data.shipment.estimated_delivery) : this.calculateEstimatedDelivery(request.customerInfo.city),
          cost: data.shipment.shipping_cost || this.calculateShippingCost(request.customerInfo.city),
          rawResponse: data,
        };
      }

      return {
        success: false,
        error: data.message || 'فشل إنشاء الشحنة',
        rawResponse: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'خطأ في الاتصال بريدبكس',
      };
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo | null> {
    try {
      if (this.testMode) {
        return this.getTestTracking(trackingNumber);
      }

      const response = await fetch(
        `${this.apiUrl}/shipments/${trackingNumber}/track`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const data: any = await response.json();

      if (data.success && data.tracking) {
        return {
          trackingNumber,
          status: data.tracking.status,
          statusAr: this.translateStatus(data.tracking.status),
          currentLocation: data.tracking.current_location,
          estimatedDelivery: data.tracking.estimated_delivery ? new Date(data.tracking.estimated_delivery) : undefined,
          actualDelivery: data.tracking.delivered_at ? new Date(data.tracking.delivered_at) : undefined,
          history: (data.tracking.events || []).map((event: any) => ({
            status: event.status,
            statusAr: this.translateStatus(event.status),
            location: event.location,
            timestamp: new Date(event.timestamp),
            notes: event.description,
          })),
        };
      }

      return null;
    } catch (error) {
      console.error('Redbox tracking error:', error);
      return null;
    }
  }

  private createTestShipment(request: ShipmentRequest): ShipmentResponse {
    const trackingNumber = `RBX${Date.now()}`;
    return {
      success: true,
      trackingNumber,
      awbNumber: trackingNumber,
      estimatedDelivery: this.calculateEstimatedDelivery(request.customerInfo.city),
      cost: this.calculateShippingCost(request.customerInfo.city),
      rawResponse: { testMode: true },
    };
  }

  private getTestTracking(trackingNumber: string): TrackingInfo {
    return {
      trackingNumber,
      status: 'in_transit',
      statusAr: 'قيد التوصيل',
      currentLocation: 'جدة',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      history: [
        {
          status: 'picked_up',
          statusAr: 'تم الاستلام',
          location: 'المستودع',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          status: 'in_transit',
          statusAr: 'قيد التوصيل',
          location: 'جدة',
          timestamp: new Date(),
        },
      ],
    };
  }

  private calculateEstimatedDelivery(city: string): Date {
    const daysMap: Record<string, number> = {
      'الرياض': 2,
      'جدة': 1,
      'الدمام': 3,
      'مكة': 1,
      'المدينة': 2,
    };
    const days = daysMap[city] || 3;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private calculateShippingCost(city: string): number {
    const costMap: Record<string, number> = {
      'الرياض': 18,
      'جدة': 15,
      'الدمام': 22,
      'مكة': 15,
      'المدينة': 20,
    };
    return costMap[city] || 25;
  }

  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'picked_up': 'تم الاستلام',
      'in_transit': 'قيد التوصيل',
      'out_for_delivery': 'خرج للتوصيل',
      'delivered': 'تم التوصيل',
      'failed': 'فشل التوصيل',
      'returned': 'تم الإرجاع',
    };
    return statusMap[status] || status;
  }
}
