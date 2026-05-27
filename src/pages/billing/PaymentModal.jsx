import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPayment, updatePayment } from '../../services/billingService'
import { X } from 'lucide-react'

const schema = z.object({
  payment_type: z.enum(['customer_payment', 'farmer_settlement']),
  amount: z.coerce.number().min(1, 'Amount is required'),
  payment_status: z.enum(['pending', 'completed', 'failed']),
  reference_number: z.string().min(1, 'Reference number is required'),
})

const PaymentModal = ({ payment, onClose, onSuccess }) => {
  const isEdit = !!payment

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_type: 'customer_payment',
      amount: '',
      payment_status: 'pending',
      reference_number: `REF-${Date.now()}`,
    }
  })

  useEffect(() => {
    if (payment) {
      reset({
        payment_type: payment.payment_type,
        amount: payment.amount,
        payment_status: payment.payment_status,
        reference_number: payment.reference_number,
      })
    }
  }, [payment])

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updatePayment(payment.id, formData)
      } else {
        await createPayment(formData)
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
            {isEdit ? 'Edit Payment' : 'Add Payment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Type</label>
            <select {...register('payment_type')} className="input">
              <option value="customer_payment">Customer Payment</option>
              <option value="farmer_settlement">Farmer Settlement</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Amount (₦)</label>
            <input {...register('amount')} type="number" className="input" placeholder="50000" />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Reference Number</label>
            <input {...register('reference_number')} className="input" placeholder="REF-001" />
            {errors.reference_number && <p className="text-red-500 text-xs mt-1">{errors.reference_number.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select {...register('payment_status')} className="input">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal