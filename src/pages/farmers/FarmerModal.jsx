import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createFarmer, updateFarmer } from '../../services/farmerService'
import { X } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone is required'),
  farm_location: z.string().min(2, 'Location is required'),
  farm_size: z.string().min(1, 'Farm size is required'),
  contract_status: z.enum(['active', 'inactive', 'pending']),
})

const FarmerModal = ({ farmer, onClose, onSuccess }) => {
  const isEdit = !!farmer

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      farm_location: '',
      farm_size: '',
      contract_status: 'pending',
    }
  })

  useEffect(() => {
    if (farmer) {
      reset({
        full_name: farmer.users?.full_name || '',
        email: farmer.users?.email || '',
        password: '',
        phone: farmer.users?.phone || '',
        farm_location: farmer.farm_location || '',
        farm_size: farmer.farm_size || '',
        contract_status: farmer.contract_status || 'pending',
      })
    }
  }, [farmer])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateFarmer(farmer.id, farmer.user_id, formData)
      } else {
        await createFarmer(formData)
      }
      onSuccess()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Farmer' : 'Add New Farmer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input {...register('full_name')} className="input" placeholder="John Doe" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input {...register('phone')} className="input" placeholder="08012345678" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="farmer@example.com" disabled={isEdit} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Farm Location</label>
              <input {...register('farm_location')} className="input" placeholder="Kano, Nigeria" />
              {errors.farm_location && <p className="text-red-500 text-xs mt-1">{errors.farm_location.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Farm Size</label>
              <input {...register('farm_size')} className="input" placeholder="5 hectares" />
              {errors.farm_size && <p className="text-red-500 text-xs mt-1">{errors.farm_size.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contract Status</label>
            <select {...register('contract_status')} className="input">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Farmer' : 'Add Farmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FarmerModal