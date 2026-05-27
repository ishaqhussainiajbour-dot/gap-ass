import { useEffect, useState } from 'react'
import { getStaff, deleteStaff } from '../../services/staffService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import StaffModal from './StaffModal'

const roleColor = (role) => {
  const colors = {
    warehouse_staff: 'bg-blue-100 text-blue-700',
    driver: 'bg-orange-100 text-orange-700',
    field_supervisor: 'bg-purple-100 text-purple-700',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

const roleLabel = (role) => {
  const labels = {
    warehouse_staff: 'Warehouse Staff',
    driver: 'Driver',
    field_supervisor: 'Field Supervisor',
  }
  return labels[role] || role
}

const StaffPage = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)

  const loadStaff = async () => {
    setLoading(true)
    try {
      const data = await getStaff()
      setStaff(data || [])
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStaff() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff member?')) return
    try {
      await deleteStaff(id)
      loadStaff()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = staff.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff</h1>
          <p className="text-gray-500 text-sm">Manage drivers, warehouse staff and field supervisors</p>
        </div>
        <button
          onClick={() => { setSelectedStaff(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Drivers', role: 'driver', color: 'bg-orange-50 text-orange-700 border-orange-200' },
          { label: 'Warehouse Staff', role: 'warehouse_staff', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Field Supervisors', role: 'field_supervisor', color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map((card) => (
          <div key={card.role} className={`rounded-xl border p-4 ${card.color}`}>
            <p className="text-sm font-medium">{card.label}</p>
            <p className="text-3xl font-bold mt-1">
              {staff.filter(s => s.role === card.role).length}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search staff..."
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
              <th className="px-5 py-3 text-left">Full Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-left">Joined</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No staff found</td></tr>
            ) : (
              filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{member.full_name}</td>
                  <td className="px-5 py-3 text-gray-500">{member.email}</td>
                  <td className="px-5 py-3 text-gray-500">{member.phone || 'N/A'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor(member.role)}`}>
                      {roleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedStaff(member); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
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
        <StaffModal
          staff={selectedStaff}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadStaff() }}
        />
      )}
    </div>
  )
}

export default StaffPage