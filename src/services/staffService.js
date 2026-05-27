import { supabase } from '../lib/supabase'

// Get all staff
export const getStaff = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('role', ['warehouse_staff', 'driver', 'field_supervisor'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Create staff member
export const createStaff = async (staffData) => {
  const { full_name, email, password, phone, role } = staffData

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const userId = authData.user.id

  // Small delay to ensure auth user is committed
  await new Promise(resolve => setTimeout(resolve, 1000))

  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    full_name,
    email,
    phone,
    role,
  })
  if (userError) throw userError

  return userId
}

// Update staff member
export const updateStaff = async (id, staffData) => {
  const { full_name, phone, role } = staffData
  const { data, error } = await supabase
    .from('users')
    .update({ full_name, phone, role })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete staff member
export const deleteStaff = async (id) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  if (error) throw error
}