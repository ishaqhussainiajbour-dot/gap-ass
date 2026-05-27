import { useEffect, useState } from 'react'
import { getHarvests, deleteHarvest, getCrops } from '../../services/cropService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import HarvestModal from './HarvestModal'

const gradeColor = (grade) => {
  if (grade === 'A') return 'bg-green-100 text-green-700'
  if (grade === 'B') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

const HarvestsPage = () => {
  const [harvests, setHarvests] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedHarvest, setSelectedHarvest] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [harvestsData, cropsData] = await Promise.all([
        getHarvests(),
        getCrops(),
      ])
      setHarvests(harvestsData || [])
      setCrops(cropsData || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this harvest record?')) return
    try {
      await deleteHarvest(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = harvests.filter(h =>
    h.crops?.crop_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.crops?.farmers?.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Harvests</h1>
          <p className="text-gray-500 text-sm">Record and track all harvest activities</p>
        </div>
        <button
          onClick={() => { setSelectedHarvest(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Record Harvest
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
              <th className="px-5 py-3 text-left">Crop</th>
              <th className="px-5 py-3 text-left">Farmer</th>
              <th className="px-5 py-3 text-left">Harvest Date</th>
              <th className="px-5 py-3 text-left">Actual Qty (kg)</th>
              <th className="px-5 py-3 text-left">Quality Grade</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No harvests found</td></tr>
            ) : (
              filtered.map((harvest) => (
                <tr key={harvest.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{harvest.crops?.crop_name}</td>
                  <td className="px-5 py-3 text-gray-500">{harvest.crops?.farmers?.users?.full_name}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {harvest.harvest_date ? new Date(harvest.harvest_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{harvest.actual_quantity}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColor(harvest.quality_grade)}`}>
                      Grade {harvest.quality_grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedHarvest(harvest); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(harvest.id)} className="text-red-500 hover:text-red-700">
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
        <HarvestModal
          harvest={selectedHarvest}
          crops={crops}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

export default HarvestsPage