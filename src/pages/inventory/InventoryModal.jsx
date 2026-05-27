import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createInventoryItem, updateInventoryItem } from '../../services/inventoryService'
import { X } from 'lucide-react'

const schema = z.object({
  warehouse_id: z.string().min(1, 'Warehouse is required'),
  lot_number: z.string().min(1, 'Lot number is required'),
  quantity: z.coerce.number().min(1, 'Quantity is required'),
  temperature: z.coerce.number().optional().or(z.literal('')),
  expiry_date: z.string().optional().or(z.literal('')),
})

const InventoryModal = ({ item, warehouses, onClose, onSuccess }) => {
  const isEdit = !!item

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      warehouse_id: '',
      lot_number: '',
      quantity: '',
      temperature: '',
      expiry_date: '',
    }
  })

  useEffect(() => {
    if (item) {
      reset({
        warehouse_id: item.warehouse_id || '',
        lot_number: item.lot_number || '',
        quantity: item.quantity || '',
        temperature: item.temperature || '',
        expiry_date: item.expiry_date || '',
      })
    }
  }, [item])

  const onSubmit = async (formData) => {
    try {
      const payload = {
        warehouse_id: formData.warehouse_id,
        lot_number: formData.lot_number,
        quantity: formData.quantity,
        temperature: formData.temperature || null,
        expiry_date: formData.expiry_date || null,
      }
      if (isEdit) {
        await updateInventoryItem(item.id, payload)
      } else {
        await createInventoryItem(payload)
      }
      onSuccess()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Warehouse</label>
            <select {...register('warehouse_id')} className="input">
              <option value="">Select warehouse</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.warehouse_name} — {w.location}</option>
              ))}
            </select>
            {errors.warehouse_id && <p className="text-red-500 text-xs mt-1">{errors.warehouse_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Lot Number</label>
            <input {...register('lot_number')} className="input" placeholder="LOT-2024-001" />
            {errors.lot_number && <p className="text-red-500 text-xs mt-1">{errors.lot_number.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Quantity (kg)</label>
              <input {...register('quantity')} type="number" className="input" placeholder="500" />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Temperature (°C)</label>
              <input {...register('temperature')} type="number" className="input" placeholder="4" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Expiry Date</label>
            <input {...register('expiry_date')} type="date" className="input" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InventoryModal