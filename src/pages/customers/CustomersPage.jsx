import { useEffect, useState } from 'react'
import { getCustomers, deleteCustomer } from '../../services/customerService'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import CustomerModal from './CustomerModal'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await getCustomers()
      setCustomers(data || [])
    } catch (err) {
      console.error('Error loading customers:', err)
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    try {
      await deleteCustomer(id)
      loadCustomers()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = customers.filter(c =>
    c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.users?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500 text-sm">Manage all business customers</p>
        </div>
        <button
          onClick={() => { setSelectedCustomer(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
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
              <th className="px-5 py-3 text-left">Business Name</th>
              <th className="px-5 py-3 text-left">Contact Person</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Address</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No customers found</td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{customer.business_name}</td>
                  <td className="px-5 py-3 text-gray-500">{customer.contact_person}</td>
                  <td className="px-5 py-3 text-gray-500">{customer.users?.email}</td>
                  <td className="px-5 py-3 text-gray-500">{customer.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{customer.address}</td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedCustomer(customer); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
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
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadCustomers() }}
        />
      )}
    </div>
  )
}

export default CustomersPage