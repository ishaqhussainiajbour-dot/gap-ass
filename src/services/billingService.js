import { supabase } from '../lib/supabase'

// Get all payments
export const getPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create payment
export const createPayment = async (paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update payment
export const updatePayment = async (id, paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .update(paymentData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete payment
export const deletePayment = async (id) => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Get payment summary
export const getPaymentSummary = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('payment_type, payment_status, amount')
  if (error) throw error

  const summary = {
    totalReceived: 0,
    totalPending: 0,
    totalSettled: 0,
    totalFailed: 0,
  }

  data.forEach(p => {
    if (p.payment_status === 'completed') summary.totalReceived += p.amount
    if (p.payment_status === 'pending') summary.totalPending += p.amount
    if (p.payment_type === 'farmer_settlement' && p.payment_status === 'completed') summary.totalSettled += p.amount
    if (p.payment_status === 'failed') summary.totalFailed += p.amount
  })

  return summary
}