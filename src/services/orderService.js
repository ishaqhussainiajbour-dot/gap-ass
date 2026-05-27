import { supabase } from '../lib/supabase'

// Get all orders
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        id,
        business_name,
        contact_person
      ),
      order_items (
        id,
        quantity,
        unit_price,
        inventory (
          id,
          lot_number
        )
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create order with items
export const createOrder = async (orderData, items) => {
  const { customer_id, delivery_date } = orderData

  const total_amount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ customer_id, delivery_date, total_amount, order_status: 'pending' })
    .select()
    .single()
  if (orderError) throw orderError

  const orderItems = items.map(item => ({
    order_id: order.id,
    inventory_id: item.inventory_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

// Update order status
export const updateOrderStatus = async (orderId, order_status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete order
export const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
  if (error) throw error
}