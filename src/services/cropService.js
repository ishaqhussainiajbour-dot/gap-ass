import { supabase } from '../lib/supabase'

// Get all crops
export const getCrops = async () => {
  const { data, error } = await supabase
    .from('crops')
    .select(`
      *,
      farmers (
        id,
        farm_location,
        users (
          full_name,
          phone
        )
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create crop
export const createCrop = async (cropData) => {
  const { data, error } = await supabase
    .from('crops')
    .insert(cropData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update crop
export const updateCrop = async (id, cropData) => {
  const { data, error } = await supabase
    .from('crops')
    .update(cropData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete crop
export const deleteCrop = async (id) => {
  const { error } = await supabase
    .from('crops')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Get all harvests
export const getHarvests = async () => {
  const { data, error } = await supabase
    .from('harvests')
    .select(`
      *,
      crops (
        id,
        crop_name,
        farmers (
          users (full_name)
        )
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create harvest
export const createHarvest = async (harvestData) => {
  const { data, error } = await supabase
    .from('harvests')
    .insert(harvestData)
    .select()
    .single()
  if (error) throw error
  return data
}

// Update harvest
export const updateHarvest = async (id, harvestData) => {
  const { data, error } = await supabase
    .from('harvests')
    .update(harvestData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete harvest
export const deleteHarvest = async (id) => {
  const { error } = await supabase
    .from('harvests')
    .delete()
    .eq('id', id)
  if (error) throw error
}