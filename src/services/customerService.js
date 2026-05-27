import { supabase } from '../lib/supabase'

// Get all customers
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
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

// Create customer
export const createCustomer = async (customerData) => {
  const { full_name, email, password, phone, business_name, contact_person, address } = customerData

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const userId = authData.user.id

  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    full_name,
    email,
    phone,
    role: 'customer',
  })
  if (userError) throw userError

  const { data, error: customerError } = await supabase
    .from('customers')
    .insert({ user_id: userId, business_name, contact_person, phone, address })
    .select()
    .single()
  if (customerError) throw customerError

  return data
}

// Update customer
export const updateCustomer = async (customerId, userId, customerData) => {
  const { full_name, phone, business_name, contact_person, address } = customerData

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name, phone })
    .eq('id', userId)
  if (userError) throw userError

  const { data, error: customerError } = await supabase
    .from('customers')
    .update({ business_name, contact_person, phone, address })
    .eq('id', customerId)
    .select()
    .single()
  if (customerError) throw customerError

  return data
}

// Delete customer
export const deleteCustomer = async (customerId) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId)
  if (error) throw error
}