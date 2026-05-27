import { useEffect, useState } from 'react'
import { getFarmers, deleteFarmer } from '../../services/farmerService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import FarmerModal from './FarmerModal'

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)

  const loadFarmers = async () => {
    setLoading(true)
    try {
      const data = await getFarmers()
      console.log('Farmers data:', data)
      setFarmers(data || [])
    } catch (err) {
      console.error('Error loading farmers:', err)
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFarmers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this farmer?')) return
    try {
      await deleteFarmer(id)
      loadFarmers()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedFarmer(null)
    setShowModal(true)
  }

  const filtered = farmers.filter(f =>
    f.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    f.users?.email?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-700'
    if (status === 'inactive') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmers</h1>
          <p className="text-gray-500 text-sm">Manage all registered farmers</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Farmer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search farmers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Farm Location</th>
              <th className="px-5 py-3 text-left">Farm Size</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No farmers found</td>
              </tr>
            ) : (
              filtered.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{farmer.users?.full_name}</td>
                  <td className="px-5 py-3 text-gray-500">{farmer.users?.email}</td>
                  <td className="px-5 py-3 text-gray-500">{farmer.users?.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{farmer.farm_location}</td>
                  <td className="px-5 py-3 text-gray-500">{farmer.farm_size}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(farmer.contract_status)}`}>
                      {farmer.contract_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button onClick={() => handleEdit(farmer)} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(farmer.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <FarmerModal
          farmer={selectedFarmer}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadFarmers() }}
        />
      )}
    </div>
  )
}

export default FarmersPage