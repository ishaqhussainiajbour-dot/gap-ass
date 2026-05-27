import { useEffect, useState } from 'react'
import { getInventory, deleteInventoryItem } from '../../services/inventoryService'
import { getWarehouses } from '../../services/warehouseService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import InventoryModal from './InventoryModal'

const InventoryPage = () => {
  const [inventory, setInventory] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [inv, war] = await Promise.all([getInventory(), getWarehouses()])
      setInventory(inv || [])
      setWarehouses(war || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this inventory item?')) return
    try {
      await deleteInventoryItem(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = inventory.filter(i =>
    i.lot_number?.toLowerCase().includes(search.toLowerCase()) ||
    i.warehouses?.warehouse_name?.toLowerCase().includes(search.toLowerCase())
  )

  const expiryColor = (date) => {
    if (!date) return 'text-gray-400'
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'text-red-600 font-medium'
    if (days <= 7) return 'text-orange-500 font-medium'
    return 'text-green-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-500 text-sm">Track all produce across warehouses</p>
        </div>
        <button
          onClick={() => { setSelectedItem(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by lot number or warehouse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Lot Number</th>
              <th className="px-5 py-3 text-left">Warehouse</th>
              <th className="px-5 py-3 text-left">Quantity (kg)</th>
              <th className="px-5 py-3 text-left">Temperature (°C)</th>
              <th className="px-5 py-3 text-left">Expiry Date</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No inventory items found</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{item.lot_number}</td>
                  <td className="px-5 py-3 text-gray-500">{item.warehouses?.warehouse_name}</td>
                  <td className="px-5 py-3 text-gray-500">{item.quantity}</td>
                  <td className="px-5 py-3 text-gray-500">{item.temperature ?? 'N/A'}</td>
                  <td className={`px-5 py-3 ${expiryColor(item.expiry_date)}`}>
                    {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button onClick={() => { setSelectedItem(item); setShowModal(true) }} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
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
        <InventoryModal
          item={selectedItem}
          warehouses={warehouses}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

export default InventoryPage