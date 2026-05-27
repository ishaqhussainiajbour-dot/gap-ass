import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCustomer, updateCustomer } from '../../services/customerService'
import { X } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone is required'),
  business_name: z.string().min(2, 'Business name is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  address: z.string().min(5, 'Address is required'),
})

const CustomerModal = ({ customer, onClose, onSuccess }) => {
  const isEdit = !!customer

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      business_name: '',
      contact_person: '',
      address: '',
    }
  })

  useEffect(() => {
    if (customer) {
      reset({
        full_name: customer.users?.full_name || '',
        email: customer.users?.email || '',
        password: '',
        phone: customer.phone || '',
        business_name: customer.business_name || '',
        contact_person: customer.contact_person || '',
        address: customer.address || '',
      })
    }
  }, [customer])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateCustomer(customer.id, customer.user_id, formData)
      } else {
        await createCustomer(formData)
      }
      onSuccess()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

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
            <input {...register('email')} type="email" className="input" placeholder="customer@example.com" disabled={isEdit} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Business Name</label>
            <input {...register('business_name')} className="input" placeholder="ABC Supermarket" />
            {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contact Person</label>
            <input {...register('contact_person')} className="input" placeholder="Jane Smith" />
            {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input {...register('address')} className="input" placeholder="123 Market Street, Kano" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerModal