'use client'

import { useState, useEffect } from 'react'
import { FiPackage, FiUsers, FiBox, FiPlus, FiDownload, FiEye } from 'react-icons/fi'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

interface Stats {
  totalShipments: number
  totalDevices: number
  totalGroups: number
  availableDevices: number
  assignedDevices: number
}

interface Shipment {
  id: string
  shipmentCode: string
  model: string
  color: string
  totalQuantity: number
  receivedDate: string
  _count: {
    devices: number
    groups: number
  }
}

interface Group {
  id: string
  groupCode: string
  clientName: string
  model: string
  color: string
  quantity: number
  labelPrinted: boolean
  createdAt: string
}

export default function DistributionPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [activeTab, setActiveTab] = useState<'shipments' | 'groups'>('shipments')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const [statsRes, shipmentsRes, groupsRes] = await Promise.all([
        fetch(`${API_URL}/distribution/stats`, { headers }),
        fetch(`${API_URL}/distribution/shipments`, { headers }),
        fetch(`${API_URL}/distribution/groups`, { headers })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (shipmentsRes.ok) setShipments(await shipmentsRes.json())
      if (groupsRes.ok) setGroups(await groupsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50" dir="rtl">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Shipment Button */}
        <div className="mb-6">
          <Link
            href="/admin/distribution/new-shipment"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="ml-2" />
            شحنة جديدة
          </Link>
        </div>
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiPackage className="text-2xl text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">إجمالي الشحنات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalShipments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiBox className="text-2xl text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">إجمالي الأجهزة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDevices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiUsers className="text-2xl text-purple-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">المجموعات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGroups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiBox className="text-2xl text-yellow-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">متاح</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableDevices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FiBox className="text-2xl text-red-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">مخصص</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.assignedDevices}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('shipments')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'shipments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiPackage className="inline ml-2" />
                الشحنات ({shipments.length})
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'groups'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiUsers className="inline ml-2" />
                مجموعات العملاء ({groups.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'shipments' ? (
              <ShipmentsTable shipments={shipments} />
            ) : (
              <GroupsTable groups={groups} onRefresh={fetchData} />
            )}
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}

function ShipmentsTable({ shipments }: { shipments: Shipment[] }) {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <FiPackage className="mx-auto text-5xl text-gray-300 mb-4" />
        <p className="text-gray-500">لا توجد شحنات</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              كود الشحنة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الموديل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              اللون
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الكمية
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              المجموعات
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              التاريخ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              إجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">
                  {shipment.shipmentCode}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shipment.model}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {shipment.color}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {shipment._count.devices} جهاز
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  {shipment._count.groups} مجموعة
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(shipment.receivedDate).toLocaleDateString('ar-SA')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/admin/distribution/shipments/${shipment.id}`}
                  className="text-blue-600 hover:text-blue-800 ml-3"
                >
                  <FiEye className="inline ml-1" />
                  عرض
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GroupsTable({ groups, onRefresh }: { groups: Group[]; onRefresh: () => void }) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <FiUsers className="mx-auto text-5xl text-gray-300 mb-4" />
        <p className="text-gray-500">لا توجد مجموعات</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              كود المجموعة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              العميل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الموديل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              اللون
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الكمية
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              الملصق
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              إجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">
                  {group.groupCode}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {group.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {group.model}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {group.color}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {group.quantity} جهاز
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {group.labelPrinted ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    تم الطباعة
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    لم يطبع
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/admin/distribution/groups/${group.id}`}
                  className="text-blue-600 hover:text-blue-800 ml-3"
                >
                  <FiEye className="inline ml-1" />
                  عرض
                </Link>
                <Link
                  href={`/admin/distribution/groups/${group.id}/label`}
                  className="text-green-600 hover:text-green-800"
                >
                  <FiDownload className="inline ml-1" />
                  ملصق
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
