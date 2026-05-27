import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCrop, updateCrop } from '../../services/cropService'
import { X } from 'lucide-react'

const schema = z.object({
  farmer_id: z.string().min(1, 'Farmer is required'),
  crop_name: z.string().min(2, 'Crop name is required'),
  planting_date: z.string().min(1, 'Planting date is required'),
  expected_harvest: z.string().min(1, 'Expected harvest date is required'),
  estimated_yield: z.coerce.number().min(1, 'Estimated yield is required'),
  status: z.enum(['planted', 'growing', 'ready', 'harvested']),
})

const CropModal = ({ crop, farmers, onClose, onSuccess }) => {
  const isEdit = !!crop

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      farmer_id: '',
      crop_name: '',
      planting_date: '',
      expected_harvest: '',
      estimated_yield: '',
      status: 'planted',
    }
  })

  useEffect(() => {
    if (crop) {
      reset({
        farmer_id: crop.farmer_id || '',
        crop_name: crop.crop_name || '',
        planting_date: crop.planting_date || '',
        expected_harvest: crop.expected_harvest || '',
        estimated_yield: crop.estimated_yield || '',
        status: crop.status || 'planted',
      })
    }
  }, [crop])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateCrop(crop.id, formData)
      } else {
        await createCrop(formData)
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
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Crop' : 'Add Crop'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Farmer</label>
            <select {...register('farmer_id')} className="input">
              <option value="">Select farmer</option>
              {farmers.map(f => (
                <option key={f.id} value={f.id}>{f.users?.full_name} — {f.farm_location}</option>
              ))}
            </select>
            {errors.farmer_id && <p className="text-red-500 text-xs mt-1">{errors.farmer_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Crop Name</label>
            <input {...register('crop_name')} className="input" placeholder="Tomatoes" />
            {errors.crop_name && <p className="text-red-500 text-xs mt-1">{errors.crop_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Planting Date</label>
              <input {...register('planting_date')} type="date" className="input" />
              {errors.planting_date && <p className="text-red-500 text-xs mt-1">{errors.planting_date.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expected Harvest</label>
              <input {...register('expected_harvest')} type="date" className="input" />
              {errors.expected_harvest && <p className="text-red-500 text-xs mt-1">{errors.expected_harvest.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Est. Yield (kg)</label>
              <input {...register('estimated_yield')} type="number" className="input" placeholder="500" />
              {errors.estimated_yield && <p className="text-red-500 text-xs mt-1">{errors.estimated_yield.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select {...register('status')} className="input">
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Crop' : 'Add Crop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CropModal