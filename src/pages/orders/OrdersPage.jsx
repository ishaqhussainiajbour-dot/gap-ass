import { useEffect, useState } from 'react'
import { getOrders, deleteOrder, updateOrderStatus } from '../../services/orderService'
import { getCustomers } from '../../services/customerService'
import { getInventory } from '../../services/inventoryService'
import { Plus, Trash2, Search, Eye } from 'lucide-react'
import OrderModal from './OrderModal'
import OrderDetailModal from './OrderDetailModal'

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

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [ord, cust, inv] = await Promise.all([
        getOrders(),
        getCustomers(),
        getInventory(),
      ])
      setOrders(ord || [])
      setCustomers(cust || [])
      setInventory(inv || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return
    try {
      await deleteOrder(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = orders.filter(o =>
    o.customers?.business_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">Manage all customer orders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Items</th>
              <th className="px-5 py-3 text-left">Total Amount</th>
              <th className="px-5 py-3 text-left">Delivery Date</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No orders found</td></tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{order.customers?.business_name}</td>
                  <td className="px-5 py-3 text-gray-500">{order.order_items?.length} item(s)</td>
                  <td className="px-5 py-3 text-gray-500">₦{order.total_amount?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(order.order_status)}`}
                    >
                      {['pending','confirmed','processing','dispatched','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedOrder(order); setShowDetail(true) }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Eye size={15} />
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <OrderModal
          customers={customers}
          inventory={inventory}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}

      {showDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  )
}

export default OrdersPage