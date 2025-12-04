'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  FiArrowRight,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
} from 'react-icons/fi'

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setSelectedStatus(data.order.status)
      } else if (response.status === 401) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return

    setUpdating(true)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        await fetchOrder()
        alert('تم تحديث حالة الطلب بنجاح')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('حدث خطأ أثناء تحديث الحالة')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-600'
      case 'processing':
        return 'bg-yellow-100 text-yellow-600'
      case 'shipped':
        return 'bg-purple-100 text-purple-600'
      case 'delivered':
        return 'bg-green-100 text-green-600'
      case 'cancelled':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد'
      case 'processing':
        return 'قيد المعالجة'
      case 'shipped':
        return 'تم الشحن'
      case 'delivered':
        return 'تم التوصيل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod':
        return 'الدفع عند الاستلام'
      case 'tap':
        return 'تاب للدفع'
      case 'tabby':
        return 'تابي'
      case 'tamara':
        return 'تمارا'
      default:
        return method
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">الطلب غير موجود</p>
            <button
              onClick={() => router.push('/admin/orders')}
              className="mt-4 btn btn-primary"
            >
              العودة للطلبات
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <FiArrowRight size={20} />
            <span>العودة للطلبات</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">طلب {order.orderNumber}</h1>
              <p className="text-gray-600 mt-1">
                تم الإنشاء في {new Date(order.createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* المنتجات */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiPackage className="text-primary-600" />
                المنتجات ({order.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FiPackage size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      <p className="text-sm text-gray-600">السعر: {item.price.toLocaleString()} ر.س</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary-600">{item.subtotal.toLocaleString()} ر.س</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* عنوان الشحن */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiMapPin className="text-primary-600" />
                عنوان التوصيل
              </h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>الاسم:</strong> {order.shippingAddress?.fullName}</p>
                <p><strong>الجوال:</strong> {order.shippingAddress?.phone}</p>
                {order.shippingAddress?.email && (
                  <p><strong>البريد:</strong> {order.shippingAddress?.email}</p>
                )}
                <p><strong>المدينة:</strong> {order.shippingAddress?.city}</p>
                <p><strong>الحي:</strong> {order.shippingAddress?.district}</p>
                <p><strong>الشارع:</strong> {order.shippingAddress?.street}</p>
                {order.shippingAddress?.buildingNumber && (
                  <p><strong>رقم المبنى:</strong> {order.shippingAddress?.buildingNumber}</p>
                )}
                {order.shippingAddress?.additionalInfo && (
                  <p><strong>معلومات إضافية:</strong> {order.shippingAddress?.additionalInfo}</p>
                )}
              </div>
            </div>

            {/* ملاحظات العميل */}
            {order.customerNotes && (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">ملاحظات العميل</h2>
                <p className="text-gray-700">{order.customerNotes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* تغيير الحالة */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">تحديث الحالة</h2>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-600 mb-4"
              >
                <option value="confirmed">مؤكد</option>
                <option value="processing">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="cancelled">ملغي</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === order.status}
                className="w-full btn btn-primary"
              >
                {updating ? 'جاري التحديث...' : 'تحديث الحالة'}
              </button>
            </div>

            {/* معلومات العميل */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiUser className="text-primary-600" />
                معلومات العميل
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiUser size={18} className="text-gray-400" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiPhone size={18} className="text-gray-400" />
                  <span dir="ltr">{order.customerPhone}</span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiMail size={18} className="text-gray-400" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                طريقة الدفع
              </h2>
              <p className="text-gray-700 mb-2">{getPaymentMethodText(order.paymentMethod)}</p>
              <p className="text-sm text-gray-600">
                حالة الدفع: <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                  {order.paymentStatus === 'paid' ? 'مدفوع' : 'قيد الانتظار'}
                </span>
              </p>
            </div>

            {/* ملخص الطلب */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>المجموع الفرعي</span>
                  <span>{order.subtotal?.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>الشحن</span>
                  <span>{order.shippingCost?.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>الضريبة</span>
                  <span>{order.tax?.toLocaleString()} ر.س</span>
                </div>
                {order.codFee && order.codFee > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>رسوم COD</span>
                    <span>{order.codFee?.toLocaleString()} ر.س</span>
                  </div>
                )}
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>-{order.discount?.toLocaleString()} ر.س</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary-600">{order.total?.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* التواريخ */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCalendar className="text-primary-600" />
                التواريخ
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء</span>
                  <span>{new Date(order.createdAt).toLocaleString('ar-SA')}</span>
                </div>
                {order.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التأكيد</span>
                    <span>{new Date(order.confirmedAt).toLocaleString('ar-SA')}</span>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الشحن</span>
                    <span>{new Date(order.shippedAt).toLocaleString('ar-SA')}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التوصيل</span>
                    <span>{new Date(order.deliveredAt).toLocaleString('ar-SA')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
