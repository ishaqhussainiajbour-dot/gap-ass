import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createWarehouse, updateWarehouse } from '../../services/warehouseService'
import { X } from 'lucide-react'

const schema = z.object({
  warehouse_name: z.string().min(2, 'Name is required'),
  location: z.string().min(2, 'Location is required'),
  capacity: z.coerce.number().min(1, 'Capacity is required'),
})

const WarehouseModal = ({ warehouse, onClose, onSuccess }) => {
  const isEdit = !!warehouse

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { warehouse_name: '', location: '', capacity: '' }
  })

  useEffect(() => {
    if (warehouse) reset(warehouse)
  }, [warehouse])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateWarehouse(warehouse.id, formData)
      } else {
        await createWarehouse(formData)
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
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Warehouse Name</label>
            <input {...register('warehouse_name')} className="input" placeholder="Cold Store A" />
            {errors.warehouse_name && <p className="text-red-500 text-xs mt-1">{errors.warehouse_name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input {...register('location')} className="input" placeholder="Kano, Nigeria" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Capacity (tons)</label>
            <input {...register('capacity')} type="number" className="input" placeholder="100" />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WarehouseModal