import { supabase } from '../lib/supabase'

export const getDashboardStats = async () => {
  const [
    { count: totalFarmers },
    { count: totalCustomers },
    { count: totalWarehouses },
    { count: activeOrders },
    { count: pendingDeliveries },
    { data: revenueData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('farmers').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('warehouses').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).not('order_status', 'eq', 'cancelled'),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('delivery_status', 'scheduled'),
    supabase.from('payments').select('amount, payment_status').eq('payment_status', 'completed').eq('payment_type', 'customer_payment'),
    supabase.from('orders').select(`
      id,
      order_status,
      total_amount,
      created_at,
      customers (business_name)
    `).order('created_at', { ascending: false }).limit(5),
  ])

  const totalRevenue = revenueData?.reduce((sum, p) => sum + p.amount, 0) || 0

  return {
    totalFarmers: totalFarmers || 0,
    totalCustomers: totalCustomers || 0,
    totalWarehouses: totalWarehouses || 0,
    activeOrders: activeOrders || 0,
    pendingDeliveries: pendingDeliveries || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
  }
}