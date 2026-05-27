import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createOrder } from '../../services/orderService'
import { X, Plus, Trash2 } from 'lucide-react'

const schema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  delivery_date: z.string().min(1, 'Delivery date is required'),
})

const OrderModal = ({ customers, inventory, onClose, onSuccess }) => {
  const [items, setItems] = useState([{ inventory_id: '', quantity: 1, unit_price: 0 }])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const addItem = () => setItems([...items, { inventory_id: '', quantity: 1, unit_price: 0 }])

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index))

  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const onSubmit = async (formData) => {
    if (items.some(i => !i.inventory_id)) {
      alert('Please select inventory item for all rows')
      return
    }
    try {
      await createOrder(formData, items)
      onSuccess()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">New Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Customer</label>
              <select {...register('customer_id')} className="input">
                <option value="">Select customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.business_name}</option>
                ))}
              </select>
              {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Delivery Date</label>
              <input {...register('delivery_date')} type="date" className="input" />
              {errors.delivery_date && <p className="text-red-500 text-xs mt-1">{errors.delivery_date.message}</p>}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Order Items</label>
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-green-600 text-xs hover:text-green-800">
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <select
                      value={item.inventory_id}
                      onChange={(e) => updateItem(index, 'inventory_id', e.target.value)}
                      className="input mt-0"
                    >
                      <option value="">Select item</option>
                      {inventory.map(i => (
                        <option key={i.id} value={i.id}>
                          {i.lot_number} ({i.quantity}kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Qty (kg)"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="input mt-0"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Unit Price ₦"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                      className="input mt-0"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Amount</span>
            <span className="text-lg font-bold text-green-700">₦{total.toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderModal