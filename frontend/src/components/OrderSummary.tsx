'use client';

interface OrderSummaryProps {
  items: any[];
  address?: any;
  shipping?: any;
  payment?: any;
  subtotal: number;
  shippingCost: number;
  tax: number;
  codFee?: number;
  total: number;
}

export default function OrderSummary({
  items,
  address,
  shipping,
  payment,
  subtotal,
  shippingCost,
  tax,
  codFee = 0,
  total,
}: OrderSummaryProps) {
  return (
    <div className="card card-lg lg:sticky" style={{ top: '96px' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>ملخص الطلب</h3>

      {/* المنتجات */}
      <div style={{ marginBottom: 'var(--space-4)', maxHeight: '256px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {items.map((item, index) => (
          <div key={index} className="flex" style={{ gap: 'var(--space-3)' }}>
            <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '56px', height: '56px' }}>
              {item.image?.startsWith('data:') || item.image?.startsWith('http') ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span style={{ fontSize: 'var(--text-xl)' }}>{item.image}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{item.nameAr || item.name}</p>
              <p className="text-gray-600" style={{ fontSize: 'var(--text-xs)' }}>الكمية: {item.quantity}</p>
              <p className="text-primary-600" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{item.price.toLocaleString()} ر.س</p>
            </div>
          </div>
        ))}
      </div>

      {/* العنوان */}
      {address && (
        <div className="border-t" style={{ paddingTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>عنوان التوصيل:</p>
          <div className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>
            <p className="text-gray-900" style={{ fontWeight: 'var(--font-semibold)' }}>{address.fullName}</p>
            <p>{address.phone}</p>
            <p>{address.street}، {address.district}</p>
            <p>{address.city}</p>
          </div>
        </div>
      )}

      {/* شركة الشحن */}
      {shipping && (
        <div className="border-t" style={{ paddingTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>شركة الشحن:</p>
          <div className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>
            <p className="text-gray-900" style={{ fontWeight: 'var(--font-semibold)' }}>{shipping.providerName}</p>
            <p>التوصيل خلال {shipping.estimatedDays} {shipping.estimatedDays === 1 ? 'يوم' : 'أيام'}</p>
          </div>
        </div>
      )}

      {/* طريقة الدفع */}
      {payment && (
        <div className="border-t" style={{ paddingTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>طريقة الدفع:</p>
          <p className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>{payment.nameAr}</p>
        </div>
      )}

      {/* الحساب */}
      <div className="border-t" style={{ paddingTop: 'var(--space-4)' }}>
        <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
          <span>المجموع الفرعي</span>
          <span style={{ fontWeight: 'var(--font-semibold)' }}>{subtotal.toLocaleString()} ر.س</span>
        </div>
        <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
          <span>الشحن</span>
          <span style={{ fontWeight: 'var(--font-semibold)' }}>
            {shippingCost === 0 ? (
              <span className="text-gray-500">يُحسب لاحقاً</span>
            ) : shippingCost === -1 ? (
              <span className="text-green-600">مجاني</span>
            ) : (
              `${shippingCost.toLocaleString()} ر.س`
            )}
          </span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            <span>الضريبة</span>
            <span style={{ fontWeight: 'var(--font-semibold)' }}>{tax.toLocaleString()} ر.س</span>
          </div>
        )}
        {codFee > 0 && (
          <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            <span>رسوم الدفع عند الاستلام</span>
            <span style={{ fontWeight: 'var(--font-semibold)' }}>{codFee.toLocaleString()} ر.س</span>
          </div>
        )}
        <div className="border-t flex justify-between" style={{ 
          paddingTop: 'var(--space-3)', 
          marginTop: 'var(--space-3)',
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-bold)' 
        }}>
          <span>الإجمالي</span>
          <span className="text-primary-600">{total.toLocaleString()} ر.س</span>
        </div>
      </div>
    </div>
  );
}
