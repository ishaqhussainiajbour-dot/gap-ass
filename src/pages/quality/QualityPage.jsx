import { useEffect, useState } from 'react'
import { getQualityChecks, deleteQualityCheck } from '../../services/qualityService'
import { getInventory } from '../../services/inventoryService'
import { Plus, Trash2, Pencil, Search, GitBranch } from 'lucide-react'
import QualityModal from './QualityModal'
import TraceabilityModal from './TraceabilityModal'

const gradeColor = (grade) => {
  if (grade === 'A') return 'bg-green-100 text-green-700'
  if (grade === 'B') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

const QualityPage = () => {
  const [checks, setChecks] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showTrace, setShowTrace] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState(null)
  const [traceLot, setTraceLot] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [ch, inv] = await Promise.all([getQualityChecks(), getInventory()])
      setChecks(ch || [])
      setInventory(inv || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this quality check?')) return
    try {
      await deleteQualityCheck(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleTrace = (lotNumber) => {
    setTraceLot(lotNumber)
    setShowTrace(true)
  }

  const filtered = checks.filter(c =>
    c.inventory?.lot_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quality Control</h1>
          <p className="text-gray-500 text-sm">Inspect produce and trace product lots</p>
        </div>
        <button
          onClick={() => { setSelectedCheck(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Inspection
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by lot number or inspector..."
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
              <th className="px-5 py-3 text-left">Inspector</th>
              <th className="px-5 py-3 text-left">Grade</th>
              <th className="px-5 py-3 text-left">Notes</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No quality checks found</td></tr>
            ) : (
              filtered.map((check) => (
                <tr key={check.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{check.inventory?.lot_number}</td>
                  <td className="px-5 py-3 text-gray-500">{check.inventory?.warehouses?.warehouse_name}</td>
                  <td className="px-5 py-3 text-gray-500">{check.users?.full_name || 'N/A'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColor(check.quality_grade)}`}>
                      Grade {check.quality_grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{check.notes || 'N/A'}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(check.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleTrace(check.inventory?.lot_number)}
                      className="text-purple-500 hover:text-purple-700"
                      title="Trace this lot"
                    >
                      <GitBranch size={15} />
                    </button>
                    <button
                      onClick={() => { setSelectedCheck(check); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(check.id)} className="text-red-500 hover:text-red-700">
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
        <QualityModal
          check={selectedCheck}
          inventory={inventory}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}

      {showTrace && (
        <TraceabilityModal
          lotNumber={traceLot}
          onClose={() => setShowTrace(false)}
        />
      )}
    </div>
  )
}

export default QualityPage