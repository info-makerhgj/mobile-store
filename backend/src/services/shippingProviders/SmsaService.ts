import { ShipmentRequest, ShipmentResponse, TrackingInfo } from '../../types/shipping';

export class SmsaService {
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;
  private testMode: boolean;

  constructor(config: { apiKey: string; apiSecret: string; apiUrl?: string; testMode?: boolean }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.apiUrl = config.apiUrl || 'https://track.smsaexpress.com/api';
    this.testMode = config.testMode || false;
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    try {
      if (this.testMode) {
        return this.createTestShipment(request);
      }

      // SMSA API Integration
      const payload = {
        passKey: this.apiKey,
        refNo: request.orderId,
        sentDate: new Date().toISOString().split('T')[0],
        idNo: '', // رقم الهوية (اختياري)
        cName: request.customerInfo.name,
        cntry: 'SA',
        cCity: request.customerInfo.city,
        cZip: request.customerInfo.postalCode || '',
        cPOBox: '',
        cMobile: request.customerInfo.phone,
        cTel1: request.customerInfo.phone,
        cTel2: '',
        cAddr1: request.customerInfo.address,
        cAddr2: '',
        shipType: 'DLV', // Delivery
        PCs: request.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
        weight: request.items.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0).toString(),
        custVal: request.totalValue.toString(),
        codAmt: request.codAmount?.toString() || '0',
        insrAmt: '0',
        itemDesc: request.items.map(item => item.name).join(', '),
      };

      const response = await fetch(`${this.apiUrl}/addShipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (data.status === 'success' || data.awbNo) {
        return {
          success: true,
          trackingNumber: data.awbNo || data.trackingNumber,
          awbNumber: data.awbNo,
          estimatedDelivery: this.calculateEstimatedDelivery(request.customerInfo.city),
          cost: this.calculateShippingCost(request.customerInfo.city),
          rawResponse: data,
        };
      }

      return {
        success: false,
        error: data.error || 'فشل إنشاء الشحنة',
        rawResponse: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'خطأ في الاتصال بسمسا',
      };
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo | null> {
    try {
      if (this.testMode) {
        return this.getTestTracking(trackingNumber);
      }

      const response = await fetch(
        `${this.apiUrl}/getTracking?passKey=${this.apiKey}&awbNo=${trackingNumber}`
      );

      const data: any = await response.json();

      if (data.status === 'success' && data.tracking) {
        return {
          trackingNumber,
          status: data.tracking.status || 'unknown',
          statusAr: this.translateStatus(data.tracking.status),
          currentLocation: data.tracking.location,
          estimatedDelivery: data.tracking.estimatedDelivery ? new Date(data.tracking.estimatedDelivery) : undefined,
          actualDelivery: data.tracking.deliveryDate ? new Date(data.tracking.deliveryDate) : undefined,
          history: (data.tracking.history || []).map((h: any) => ({
            status: h.status,
            statusAr: this.translateStatus(h.status),
            location: h.location,
            timestamp: new Date(h.date),
            notes: h.notes,
          })),
        };
      }

      return null;
    } catch (error) {
      console.error('SMSA tracking error:', error);
      return null;
    }
  }

  private createTestShipment(request: ShipmentRequest): ShipmentResponse {
    const trackingNumber = `SMSA${Date.now()}`;
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
      currentLocation: 'الرياض',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      history: [
        {
          status: 'picked_up',
          statusAr: 'تم الاستلام',
          location: 'المستودع الرئيسي',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          status: 'in_transit',
          statusAr: 'قيد التوصيل',
          location: 'الرياض',
          timestamp: new Date(),
        },
      ],
    };
  }

  private calculateEstimatedDelivery(city: string): Date {
    const daysMap: Record<string, number> = {
      'الرياض': 1,
      'جدة': 2,
      'الدمام': 2,
      'مكة': 2,
      'المدينة': 2,
    };
    const days = daysMap[city] || 3;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private calculateShippingCost(city: string): number {
    const costMap: Record<string, number> = {
      'الرياض': 15,
      'جدة': 20,
      'الدمام': 20,
      'مكة': 20,
      'المدينة': 25,
    };
    return costMap[city] || 30;
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
