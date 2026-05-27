import { supabase } from '../lib/supabase'

// Get all inventory
export const getInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      warehouses (
        id,
        warehouse_name,
        location
      ),
      harvests (
        id,
        actual_quantity,
        quality_grade
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create inventory item
export const createInventoryItem = async (inventoryData) => {
  const { data, error } = await supabase
    .from('inventory')
    .insert(inventoryData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update inventory item
export const updateInventoryItem = async (id, inventoryData) => {
  const { data, error } = await supabase
    .from('inventory')
    .update(inventoryData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete inventory item
export const deleteInventoryItem = async (id) => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)
  if (error) throw error
}