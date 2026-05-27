import { useEffect, useState } from 'react'
import { getWarehouses, deleteWarehouse } from '../../services/warehouseService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import WarehouseModal from './WarehouseModal'

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const loadWarehouses = async () => {
    setLoading(true)
    try {
      const data = await getWarehouses()
      setWarehouses(data || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadWarehouses() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this warehouse?')) return
    try {
      await deleteWarehouse(id)
      loadWarehouses()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = warehouses.filter(w =>
    w.warehouse_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warehouses</h1>
          <p className="text-gray-500 text-sm">Manage all storage facilities</p>
        </div>
        <button
          onClick={() => { setSelectedWarehouse(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Warehouse
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search warehouses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Warehouse Name</th>
              <th className="px-5 py-3 text-left">Location</th>
              <th className="px-5 py-3 text-left">Capacity</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No warehouses found</td></tr>
            ) : (
              filtered.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{warehouse.warehouse_name}</td>
                  <td className="px-5 py-3 text-gray-500">{warehouse.location}</td>
                  <td className="px-5 py-3 text-gray-500">{warehouse.capacity} tons</td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button onClick={() => { setSelectedWarehouse(warehouse); setShowModal(true) }} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(warehouse.id)} className="text-red-500 hover:text-red-700">
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
        <WarehouseModal
          warehouse={selectedWarehouse}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadWarehouses() }}
        />
      )}
    </div>
  )
}

export default WarehousesPage