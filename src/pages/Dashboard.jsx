import { useEffect, useState } from 'react'
import { getDashboardStats } from '../services/dashboardService'
import {
  Users, ShoppingCart, Truck, Warehouse,
  TrendingUp, Package, Loader
} from 'lucide-react'

const statusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    dispatched: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size={28} className="animate-spin text-green-600" />
    </div>
  )

  const cards = [
    { label: 'Total Farmers', value: stats.totalFarmers, icon: Users, color: 'bg-green-500', light: 'bg-green-50 text-green-600' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingCart, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Truck, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
    { label: 'Warehouses', value: stats.totalWarehouses, icon: Warehouse, color: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Here's what's happening at GAP today.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.light}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-green-600" />
          <h2 className="text-base font-semibold text-gray-800">Recent Orders</h2>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {order.customers?.business_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      ₦{order.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard