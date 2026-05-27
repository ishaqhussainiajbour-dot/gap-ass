import { useEffect, useState } from 'react'
import { getPayments, deletePayment, updatePayment, getPaymentSummary } from '../../services/billingService'
import { Plus, Trash2, Pencil, Search } from 'lucide-react'
import PaymentModal from './PaymentModal'

const statusColor = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-700'
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

const typeColor = (type) => {
  if (type === 'customer_payment') return 'bg-blue-100 text-blue-700'
  return 'bg-purple-100 text-purple-700'
}

const BillingPage = () => {
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [pay, sum] = await Promise.all([getPayments(), getPaymentSummary()])
      setPayments(pay || [])
      setSummary(sum)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this payment record?')) return
    try {
      await deletePayment(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusChange = async (id, payment_status) => {
    try {
      await updatePayment(id, { payment_status })
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = payments.filter(p =>
    p.reference_number?.toLowerCase().includes(search.toLowerCase()) ||
    p.payment_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing & Payments</h1>
          <p className="text-gray-500 text-sm">Manage invoices and farmer settlements</p>
        </div>
        <button
          onClick={() => { setSelectedPayment(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Received', value: summary.totalReceived || 0, color: 'bg-green-500' },
          { label: 'Pending Payments', value: summary.totalPending || 0, color: 'bg-yellow-500' },
          { label: 'Farmer Settlements', value: summary.totalSettled || 0, color: 'bg-purple-500' },
          { label: 'Failed Payments', value: summary.totalFailed || 0, color: 'bg-red-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-gray-500 text-sm mb-1">{card.label}</p>
            <p className={`text-2xl font-bold text-gray-800`}>
              ₦{card.value.toLocaleString()}
            </p>
            <div className={`h-1 rounded-full mt-3 ${card.color} opacity-60`} />
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by reference or type..."
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
              <th className="px-5 py-3 text-left">Reference</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No payments found</td></tr>
            ) : (
              filtered.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{payment.reference_number}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor(payment.payment_type)}`}>
                      {payment.payment_type === 'customer_payment' ? 'Customer Payment' : 'Farmer Settlement'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">₦{payment.amount?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <select
                      value={payment.payment_status}
                      onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(payment.payment_status)}`}
                    >
                      {['pending', 'completed', 'failed'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedPayment(payment); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(payment.id)} className="text-red-500 hover:text-red-700">
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
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

export default BillingPage