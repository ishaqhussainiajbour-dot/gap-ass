import { useEffect, useState } from 'react'
import { getTraceability } from '../../services/qualityService'
import { X, Loader } from 'lucide-react'

const TraceabilityModal = ({ lotNumber, onClose }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getTraceability(lotNumber)
        setData(result)
      } catch (err) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lotNumber])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Traceability — {lotNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader size={24} className="animate-spin text-green-600" />
          </div>
        ) : !data ? (
          <p className="text-center text-gray-400 py-8">No traceability data found for this lot.</p>
        ) : (
          <div className="space-y-5 text-sm">

            {/* Inventory Info */}
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-700 mb-2">📦 Inventory</h3>
              <p className="text-gray-600">Lot: <span className="font-medium">{data.lot_number}</span></p>
              <p className="text-gray-600">Quantity: <span className="font-medium">{data.quantity} kg</span></p>
              <p className="text-gray-600">Warehouse: <span className="font-medium">{data.warehouses?.warehouse_name} — {data.warehouses?.location}</span></p>
              <p className="text-gray-600">Expiry: <span className="font-medium">{data.expiry_date ? new Date(data.expiry_date).toLocaleDateString() : 'N/A'}</span></p>
            </div>

            {/* Harvest & Crop Info */}
            {data.harvests && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-700 mb-2">🌾 Harvest & Crop</h3>
                <p className="text-gray-600">Crop: <span className="font-medium">{data.harvests?.crops?.crop_name}</span></p>
                <p className="text-gray-600">Harvest Date: <span className="font-medium">{data.harvests?.harvest_date ? new Date(data.harvests.harvest_date).toLocaleDateString() : 'N/A'}</span></p>
                <p className="text-gray-600">Quantity Harvested: <span className="font-medium">{data.harvests?.actual_quantity} kg</span></p>
                <p className="text-gray-600">Farmer: <span className="font-medium">{data.harvests?.crops?.farmers?.users?.full_name}</span></p>
                <p className="text-gray-600">Farm Location: <span className="font-medium">{data.harvests?.crops?.farmers?.farm_location}</span></p>
              </div>
            )}

            {/* Quality Checks */}
            {data.quality_checks?.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-700 mb-2">✅ Quality Checks</h3>
                {data.quality_checks.map((qc, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-gray-600">Grade: <span className="font-medium">Grade {qc.quality_grade}</span></p>
                    <p className="text-gray-600">Inspector: <span className="font-medium">{qc.users?.full_name}</span></p>
                    <p className="text-gray-600">Notes: <span className="font-medium">{qc.notes || 'N/A'}</span></p>
                    <p className="text-gray-600">Date: <span className="font-medium">{new Date(qc.created_at).toLocaleDateString()}</span></p>
                  </div>
                ))}
              </div>
            )}

            {/* Orders */}
            {data.order_items?.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-700 mb-2">🛒 Orders</h3>
                {data.order_items.map((oi, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-gray-600">Customer: <span className="font-medium">{oi.orders?.customers?.business_name}</span></p>
                    <p className="text-gray-600">Quantity: <span className="font-medium">{oi.quantity} kg</span></p>
                    <p className="text-gray-600">Status: <span className="font-medium capitalize">{oi.orders?.order_status}</span></p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  )
}

export default TraceabilityModal