import { supabase } from '../lib/supabase'

// Get all quality checks
export const getQualityChecks = async () => {
  const { data, error } = await supabase
    .from('quality_checks')
    .select(`
      *,
      inventory (
        id,
        lot_number,
        quantity,
        warehouses (
          warehouse_name
        )
      ),
      users (
        id,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create quality check
export const createQualityCheck = async (checkData) => {
  const { data, error } = await supabase
    .from('quality_checks')
    .insert(checkData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update quality check
export const updateQualityCheck = async (id, checkData) => {
  const { data, error } = await supabase
    .from('quality_checks')
    .update(checkData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete quality check
export const deleteQualityCheck = async (id) => {
  const { error } = await supabase
    .from('quality_checks')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Get traceability for a lot number
export const getTraceability = async (lotNumber) => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      warehouses (warehouse_name, location),
      harvests (
        id,
        actual_quantity,
        harvest_date,
        quality_grade,
        crops (
          crop_name,
          planting_date,
          expected_harvest,
          farmers (
            farm_location,
            farm_size,
            users (full_name, phone)
          )
        )
      ),
      quality_checks (
        quality_grade,
        notes,
        created_at,
        users (full_name)
      ),
      order_items (
        quantity,
        unit_price,
        orders (
          order_status,
          delivery_date,
          customers (business_name)
        )
      )
    `)
    .eq('lot_number', lotNumber)
    .maybeSingle()
  if (error) throw error
  return data
}