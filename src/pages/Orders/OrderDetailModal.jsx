import { X } from 'lucide-react'

const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer</span>
            <span className="font-medium">{order.customers?.business_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize">{order.order_status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Date</span>
            <span className="font-medium">
              {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-green-700">₦{order.total_amount?.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
            {order.order_items?.length === 0 ? (
              <p className="text-center py-4 text-gray-400 text-sm">No items</p>
            ) : (
              order.order_items?.map((item) => (
                <div key={item.id} className="px-4 py-3 flex justify-between text-sm">
                  <span className="text-gray-600">{item.inventory?.lot_number}</span>
                  <span className="text-gray-500">{item.quantity}kg × ₦{item.unit_price}</span>
                  <span className="font-medium text-gray-800">₦{(item.quantity * item.unit_price).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal