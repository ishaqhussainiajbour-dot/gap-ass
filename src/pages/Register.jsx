import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { registerCustomer } from '../services/authService'

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Please confirm your password'),
  phone: z.string().min(5, 'Phone is required'),
  business_name: z.string().min(2, 'Business name is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  address: z.string().min(5, 'Address is required'),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (formData) => {
    setError('')
    try {
      await registerCustomer(formData)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">GAP</h1>
          <p className="text-gray-500 text-sm mt-1">Create a Customer Account</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            Registration successful! Redirecting to login...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Info */}
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
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input {...register('confirm_password')} type="password" className="input" placeholder="••••••••" />
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>
          </div>

          {/* Business Info */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Business Information</p>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Business Address</label>
              <input {...register('address')} className="input" placeholder="123 Market Street, Kano" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register