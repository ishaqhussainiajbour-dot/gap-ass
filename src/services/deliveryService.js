import { supabase } from '../lib/supabase'

// Get all deliveries
export const getDeliveries = async () => {
  const { data, error } = await supabase
    .from('deliveries')
    .select(`
      *,
      orders (
        id,
        order_status,
        total_amount,
        customers (
          business_name
        )
      ),
      users (
        id,
        full_name,
        phone
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create delivery
export const createDelivery = async (deliveryData) => {
  const { data, error } = await supabase
    .from('deliveries')
    .insert(deliveryData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update delivery status
export const updateDelivery = async (id, deliveryData) => {
  const { data, error } = await supabase
    .from('deliveries')
    .update(deliveryData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete delivery
export const deleteDelivery = async (id) => {
  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id)
  if (error) throw error
}