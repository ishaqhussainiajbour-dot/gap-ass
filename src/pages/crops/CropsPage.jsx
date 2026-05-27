import { useEffect, useState } from 'react'
import { getCrops, deleteCrop } from '../../services/cropService'
import { getFarmers } from '../../services/farmerService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import CropModal from './CropModal'

const statusColor = (status) => {
  const colors = {
    planted: 'bg-blue-100 text-blue-700',
    growing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    harvested: 'bg-gray-100 text-gray-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const CropsPage = () => {
  const [crops, setCrops] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [cropsData, farmersData] = await Promise.all([
        getCrops(),
        getFarmers(),
      ])
      setCrops(cropsData || [])
      setFarmers(farmersData || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop?')) return
    try {
      await deleteCrop(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = crops.filter(c =>
    c.crop_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.farmers?.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Crops</h1>
          <p className="text-gray-500 text-sm">Track all crop planting and schedules</p>
        </div>
        <button
          onClick={() => { setSelectedCrop(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Crop
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by crop or farmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Crop Name</th>
              <th className="px-5 py-3 text-left">Farmer</th>
              <th className="px-5 py-3 text-left">Planting Date</th>
              <th className="px-5 py-3 text-left">Expected Harvest</th>
              <th className="px-5 py-3 text-left">Est. Yield (kg)</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No crops found</td></tr>
            ) : (
              filtered.map((crop) => (
                <tr key={crop.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{crop.crop_name}</td>
                  <td className="px-5 py-3 text-gray-500">{crop.farmers?.users?.full_name}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {crop.expected_harvest ? new Date(crop.expected_harvest).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{crop.estimated_yield ?? 'N/A'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(crop.status)}`}>
                      {crop.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedCrop(crop); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(crop.id)} className="text-red-500 hover:text-red-700">
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
        <CropModal
          crop={selectedCrop}
          farmers={farmers}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

export default CropsPage