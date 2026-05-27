import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createHarvest, updateHarvest } from '../../services/cropService'
import { X } from 'lucide-react'

const schema = z.object({
  crop_id: z.string().min(1, 'Crop is required'),
  harvest_date: z.string().min(1, 'Harvest date is required'),
  actual_quantity: z.coerce.number().min(1, 'Quantity is required'),
  quality_grade: z.enum(['A', 'B', 'C']),
})

const HarvestModal = ({ harvest, crops, onClose, onSuccess }) => {
  const isEdit = !!harvest

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      crop_id: '',
      harvest_date: '',
      actual_quantity: '',
      quality_grade: 'A',
    }
  })

  useEffect(() => {
    if (harvest) {
      reset({
        crop_id: harvest.crop_id || '',
        harvest_date: harvest.harvest_date || '',
        actual_quantity: harvest.actual_quantity || '',
        quality_grade: harvest.quality_grade || 'A',
      })
    }
  }, [harvest])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateHarvest(harvest.id, formData)
      } else {
        await createHarvest(formData)
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
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Harvest' : 'Record Harvest'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Crop</label>
            <select {...register('crop_id')} className="input" disabled={isEdit}>
              <option value="">Select crop</option>
              {crops.map(c => (
                <option key={c.id} value={c.id}>
                  {c.crop_name} — {c.farmers?.users?.full_name}
                </option>
              ))}
            </select>
            {errors.crop_id && <p className="text-red-500 text-xs mt-1">{errors.crop_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Harvest Date</label>
            <input {...register('harvest_date')} type="date" className="input" />
            {errors.harvest_date && <p className="text-red-500 text-xs mt-1">{errors.harvest_date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Actual Quantity (kg)</label>
              <input {...register('actual_quantity')} type="number" className="input" placeholder="500" />
              {errors.actual_quantity && <p className="text-red-500 text-xs mt-1">{errors.actual_quantity.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Quality Grade</label>
              <select {...register('quality_grade')} className="input">
                <option value="A">Grade A — Excellent</option>
                <option value="B">Grade B — Good</option>
                <option value="C">Grade C — Fair</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Record Harvest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HarvestModal