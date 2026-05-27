import { useEffect, useState } from 'react'
import { getDeliveries, deleteDelivery, updateDelivery } from '../../services/deliveryService'
import { getOrders } from '../../services/orderService'
import { Plus, Trash2, Search } from 'lucide-react'
import DeliveryModal from './DeliveryModal'

const statusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [del, ord] = await Promise.all([getDeliveries(), getOrders()])
      setDeliveries(del || [])
      setOrders(ord || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this delivery?')) return
    try {
      await deleteDelivery(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusChange = async (id, delivery_status) => {
    try {
      await updateDelivery(id, { delivery_status })
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = deliveries.filter(d =>
    d.orders?.customers?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Deliveries</h1>
          <p className="text-gray-500 text-sm">Track and manage all deliveries</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Schedule Delivery
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or driver..."
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
              <th className="px-5 py-3 text-left">Driver</th>
              <th className="px-5 py-3 text-left">Vehicle</th>
              <th className="px-5 py-3 text-left">Order Amount</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No deliveries found</td></tr>
            ) : (
              filtered.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{delivery.orders?.customers?.business_name}</td>
                  <td className="px-5 py-3 text-gray-500">{delivery.users?.full_name || 'Unassigned'}</td>
                  <td className="px-5 py-3 text-gray-500">{delivery.vehicle_number || 'N/A'}</td>
                  <td className="px-5 py-3 text-gray-500">₦{delivery.orders?.total_amount?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <select
                      value={delivery.delivery_status}
                      onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(delivery.delivery_status)}`}
                    >
                      {['scheduled', 'in_transit', 'delivered', 'failed'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(delivery.id)} className="text-red-500 hover:text-red-700">
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
        <DeliveryModal
          orders={orders}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

export default DeliveriesPage