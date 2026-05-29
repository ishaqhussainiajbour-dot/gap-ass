import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authService'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (formData) => {
    setError('')
    try {
      await forgotPassword(formData.email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email.')
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">GAP</h1>
          <p className="text-gray-500 text-sm mt-1">Reset your password</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 text-sm px-4 py-4 rounded-lg mb-4">
              Password reset email sent! Check your inbox and follow the link to reset your password.
            </div>
            <Link to="/login" className="text-green-600 hover:underline text-sm font-medium">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Email'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword