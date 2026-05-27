import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createQualityCheck, updateQualityCheck } from '../../services/qualityService'
import useAuthStore from '../../store/authStore'
import { X } from 'lucide-react'

const schema = z.object({
  inventory_id: z.string().min(1, 'Inventory item is required'),
  quality_grade: z.enum(['A', 'B', 'C']),
  notes: z.string().optional(),
})

const QualityModal = ({ check, inventory, onClose, onSuccess }) => {
  const isEdit = !!check
  const { user } = useAuthStore()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      inventory_id: '',
      quality_grade: 'A',
      notes: '',
    }
  })

  useEffect(() => {
    if (check) {
      reset({
        inventory_id: check.inventory_id || '',
        quality_grade: check.quality_grade || 'A',
        notes: check.notes || '',
      })
    }
  }, [check])

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        checked_by: user?.id,
      }
      if (isEdit) {
        await updateQualityCheck(check.id, payload)
      } else {
        await createQualityCheck(payload)
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
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Inspection' : 'Add Quality Inspection'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Inventory Item (Lot)</label>
            <select {...register('inventory_id')} className="input" disabled={isEdit}>
              <option value="">Select lot</option>
              {inventory.map(i => (
                <option key={i.id} value={i.id}>
                  {i.lot_number} — {i.warehouses?.warehouse_name}
                </option>
              ))}
            </select>
            {errors.inventory_id && <p className="text-red-500 text-xs mt-1">{errors.inventory_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Quality Grade</label>
            <select {...register('quality_grade')} className="input">
              <option value="A">Grade A — Excellent</option>
              <option value="B">Grade B — Good</option>
              <option value="C">Grade C — Fair</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register('notes')}
              className="input resize-none"
              rows={3}
              placeholder="Any observations about this lot..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Save Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QualityModal