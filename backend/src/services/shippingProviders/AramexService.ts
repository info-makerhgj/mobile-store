import { ShipmentRequest, ShipmentResponse, TrackingInfo } from '../../types/shipping';

export class AramexService {
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;
  private accountNumber: string;
  private testMode: boolean;

  constructor(config: { apiKey: string; apiSecret: string; accountNumber?: string; apiUrl?: string; testMode?: boolean }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.accountNumber = config.accountNumber || '';
    this.apiUrl = config.apiUrl || 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json';
    this.testMode = config.testMode || false;
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    try {
      if (this.testMode) {
        return this.createTestShipment(request);
      }

      // Aramex API Integration
      const payload = {
        ClientInfo: {
          UserName: this.apiKey,
          Password: this.apiSecret,
          Version: 'v1.0',
          AccountNumber: this.accountNumber,
          AccountPin: this.apiSecret,
          AccountEntity: 'RUH',
          AccountCountryCode: 'SA',
        },
        Transaction: {
          Reference1: request.orderId,
          Reference2: '',
          Reference3: '',
          Reference4: '',
          Reference5: '',
        },
        Shipments: [
          {
            Reference1: request.orderId,
            Reference2: '',
            Reference3: '',
            Shipper: {
              Reference1: '',
              Reference2: '',
              AccountNumber: this.accountNumber,
            },
            Consignee: {
              PartyAddress: {
                Line1: request.customerInfo.address,
                Line2: '',
                Line3: '',
                City: request.customerInfo.city,
                StateOrProvinceCode: '',
                PostCode: request.customerInfo.postalCode || '',
                CountryCode: 'SA',
              },
              Contact: {
                PersonName: request.customerInfo.name,
                CompanyName: '',
                PhoneNumber1: request.customerInfo.phone,
                PhoneNumber1Ext: '',
                PhoneNumber2: '',
                PhoneNumber2Ext: '',
                FaxNumber: '',
                CellPhone: request.customerInfo.phone,
                EmailAddress: request.customerInfo.email || '',
              },
            },
            Details: {
              Dimensions: {
                Length: 0,
                Width: 0,
                Height: 0,
                Unit: 'cm',
              },
              ActualWeight: {
                Value: request.items.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0),
                Unit: 'kg',
              },
              ProductGroup: 'DOM',
              ProductType: 'PDX',
              PaymentType: 'P',
              PaymentOptions: '',
              Services: '',
              NumberOfPieces: request.items.reduce((sum, item) => sum + item.quantity, 0),
              DescriptionOfGoods: request.items.map(item => item.name).join(', '),
              GoodsOriginCountry: 'SA',
              CashOnDeliveryAmount: {
                Value: request.codAmount || 0,
                CurrencyCode: 'SAR',
              },
              CustomsValueAmount: {
                Value: request.totalValue,
                CurrencyCode: 'SAR',
              },
            },
          },
        ],
      };

      const response = await fetch(`${this.apiUrl}/CreateShipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (data.HasErrors === false && data.Shipments && data.Shipments.length > 0) {
        const shipment = data.Shipments[0];
        return {
          success: true,
          trackingNumber: shipment.ID,
          awbNumber: shipment.ID,
          estimatedDelivery: this.calculateEstimatedDelivery(request.customerInfo.city),
          cost: this.calculateShippingCost(request.customerInfo.city),
          rawResponse: data,
        };
      }

      return {
        success: false,
        error: data.Notifications?.[0]?.Message || 'فشل إنشاء الشحنة',
        rawResponse: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'خطأ في الاتصال بأرامكس',
      };
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo | null> {
    try {
      if (this.testMode) {
        return this.getTestTracking(trackingNumber);
      }

      const payload = {
        ClientInfo: {
          UserName: this.apiKey,
          Password: this.apiSecret,
          Version: 'v1.0',
          AccountNumber: this.accountNumber,
          AccountPin: this.apiSecret,
          AccountEntity: 'RUH',
          AccountCountryCode: 'SA',
        },
        Transaction: {
          Reference1: '',
          Reference2: '',
          Reference3: '',
          Reference4: '',
          Reference5: '',
        },
        Shipments: [trackingNumber],
      };

      const response = await fetch(`${this.apiUrl}/TrackShipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (data.HasErrors === false && data.TrackingResults && data.TrackingResults.length > 0) {
        const tracking = data.TrackingResults[0];
        return {
          trackingNumber,
          status: tracking.UpdateCode || 'unknown',
          statusAr: this.translateStatus(tracking.UpdateCode),
          currentLocation: tracking.UpdateLocation,
          estimatedDelivery: tracking.EstimatedDeliveryDate ? new Date(tracking.EstimatedDeliveryDate) : undefined,
          actualDelivery: tracking.ActualDeliveryDate ? new Date(tracking.ActualDeliveryDate) : undefined,
          history: (tracking.TrackingHistory || []).map((h: any) => ({
            status: h.UpdateCode,
            statusAr: this.translateStatus(h.UpdateCode),
            location: h.UpdateLocation,
            timestamp: new Date(h.UpdateDateTime),
            notes: h.UpdateDescription,
          })),
        };
      }

      return null;
    } catch (error) {
      console.error('Aramex tracking error:', error);
      return null;
    }
  }

  private createTestShipment(request: ShipmentRequest): ShipmentResponse {
    const trackingNumber = `ARX${Date.now()}`;
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
      currentLocation: 'الدمام',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
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
          location: 'الدمام',
          timestamp: new Date(),
        },
      ],
    };
  }

  private calculateEstimatedDelivery(city: string): Date {
    const daysMap: Record<string, number> = {
      'الرياض': 2,
      'جدة': 3,
      'الدمام': 1,
      'مكة': 3,
      'المدينة': 3,
    };
    const days = daysMap[city] || 4;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private calculateShippingCost(city: string): number {
    const costMap: Record<string, number> = {
      'الرياض': 20,
      'جدة': 25,
      'الدمام': 18,
      'مكة': 25,
      'المدينة': 28,
    };
    return costMap[city] || 30;
  }

  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'SH007': 'قيد الانتظار',
      'SH010': 'تم الاستلام',
      'SH014': 'قيد التوصيل',
      'SH003': 'خرج للتوصيل',
      'SH004': 'تم التوصيل',
      'SH009': 'فشل التوصيل',
      'SH011': 'تم الإرجاع',
    };
    return statusMap[status] || status;
  }
}
