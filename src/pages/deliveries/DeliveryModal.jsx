import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createDelivery } from '../../services/deliveryService'
import { X } from 'lucide-react'

const schema = z.object({
  order_id: z.string().min(1, 'Order is required'),
  vehicle_number: z.string().min(1, 'Vehicle number is required'),
})

const DeliveryModal = ({ orders, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (formData) => {
    try {
      await createDelivery({
        order_id: formData.order_id,
        vehicle_number: formData.vehicle_number,
        delivery_status: 'scheduled',
      })
      onSuccess()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Schedule Delivery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Order</label>
            <select {...register('order_id')} className="input">
              <option value="">Select order</option>
              {orders.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').map(o => (
                <option key={o.id} value={o.id}>
                  {o.customers?.business_name} — ₦{o.total_amount?.toLocaleString()}
                </option>
              ))}
            </select>
            {errors.order_id && <p className="text-red-500 text-xs mt-1">{errors.order_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Vehicle Plate Number</label>
            <input {...register('vehicle_number')} className="input" placeholder="ABC-123-XY" />
            {errors.vehicle_number && <p className="text-red-500 text-xs mt-1">{errors.vehicle_number.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Schedule Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeliveryModal