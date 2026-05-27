import { supabase } from '../lib/supabase'

// Get all farmers with user info
export const getFarmers = async () => {
  const { data, error } = await supabase
    .from('farmers')
    .select(`
      *,
      users (
        id,
        full_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Get single farmer
export const getFarmerById = async (id) => {
  const { data, error } = await supabase
    .from('farmers')
    .select(`*, users(*)`)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Create farmer using regular signup
export const createFarmer = async (farmerData) => {
  const { full_name, email, password, phone, farm_location, farm_size, contract_status } = farmerData

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  // Auto confirm the user
  await supabase.rpc('confirm_user', { user_email: email }).catch(() => {})
  if (authError) throw authError

  const userId = authData.user.id

  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    full_name,
    email,
    phone,
    role: 'farmer',
  })
  if (userError) throw userError

  const { data, error: farmerError } = await supabase
    .from('farmers')
    .insert({
      user_id: userId,
      farm_location,
      farm_size,
      contract_status,
    })
    .select()
    .single()
  if (farmerError) throw farmerError

  return data
}

// Update farmer
export const updateFarmer = async (farmerId, userId, farmerData) => {
  const { full_name, phone, farm_location, farm_size, contract_status } = farmerData

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name, phone })
    .eq('id', userId)
  if (userError) throw userError

  const { data, error: farmerError } = await supabase
    .from('farmers')
    .update({ farm_location, farm_size, contract_status })
    .eq('id', farmerId)
    .select()
    .single()
  if (farmerError) throw farmerError

  return data
}

// Delete farmer
export const deleteFarmer = async (farmerId) => {
  const { error } = await supabase
    .from('farmers')
    .delete()
    .eq('id', farmerId)
  if (error) throw error
}