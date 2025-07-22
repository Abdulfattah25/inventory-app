import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => user.value)

  // Actions
  const login = async (email, password) => {
    loading.value = true
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      if (data.user && data.session) {
        user.value = data.user
        session.value = data.session
        
        // Redirect to dashboard after successful login
        router.push('/dashboard')
        
        return {
          success: true,
          user: data.user,
          session: data.session
        }
      }

    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
      }

      user.value = null
      session.value = null
      
      router.push('/login')
      
      return { success: true }

    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Get session error:', error)
        return
      }

      if (session) {
        user.value = session.user
        session.value = session
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          user.value = session.user
          session.value = session
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          session.value = null
        }
      })

    } catch (error) {
      console.error('Check auth error:', error)
    } finally {
      initialized.value = true
    }
  }

  const initialize = async () => {
    return await checkAuth()
  }

  return {
    // State
    user,
    session,
    loading,
    initialized,
    
    // Getters
    isAuthenticated,
    userProfile,
    
    // Actions
    login,
    logout,
    checkAuth,
    initialize
  }
})
