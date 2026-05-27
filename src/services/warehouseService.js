import { supabase } from '../lib/supabase'

// Get all warehouses
export const getWarehouses = async () => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create warehouse
export const createWarehouse = async (warehouseData) => {
  const { data, error } = await supabase
    .from('warehouses')
    .insert(warehouseData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update warehouse
export const updateWarehouse = async (id, warehouseData) => {
  const { data, error } = await supabase
    .from('warehouses')
    .update(warehouseData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete warehouse
export const deleteWarehouse = async (id) => {
  const { error } = await supabase
    .from('warehouses')
    .delete()
    .eq('id', id)
  if (error) throw error
}