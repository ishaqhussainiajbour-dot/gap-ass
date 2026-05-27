import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { getUserProfile } from '../services/authService'

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    set({ loading: true })

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await getUserProfile(session.user.id)
        set({ user: session.user, profile, loading: false })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    } catch (err) {
      console.error('Init error:', err)
      set({ user: null, profile: null, loading: false })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      if (session?.user) {
        try {
          const profile = await getUserProfile(session.user.id)
          set({ user: session.user, profile, loading: false })
        } catch (err) {
          console.error('Profile fetch error:', err)
          set({ user: session.user, profile: null, loading: false })
        }
      } else {
        set({ user: null, profile: null, loading: false })
      }
    })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  }
}))

export default useAuthStore