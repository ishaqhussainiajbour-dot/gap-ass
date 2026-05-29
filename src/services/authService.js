import { supabase } from '../lib/supabase'

// Login
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

// Customer self registration
export const registerCustomer = async (formData) => {
  const { full_name, email, password, phone, business_name, contact_person, address } = formData

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const userId = authData.user.id

  await new Promise(resolve => setTimeout(resolve, 1000))

  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    full_name,
    email,
    phone,
    role: 'customer',
  })
  if (userError) throw userError

  const { error: customerError } = await supabase.from('customers').insert({
    user_id: userId,
    business_name,
    contact_person,
    phone,
    address,
  })
  if (customerError) throw customerError

  return authData
}

// Forgot password
export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

// Reset password
export const resetPassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}