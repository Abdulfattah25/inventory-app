import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, dbHelpers, TABLES } from '@/services/supabase'
import { TRANSACTION_TYPES, DEFAULT_CATEGORIES } from '@/utils/constants'
import { useAuthStore } from './auth'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const incomeCategories = computed(() => 
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.INCOME)
  )
  
  const expenseCategories = computed(() => 
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.EXPENSE)
  )
  
  const activeCategoriesCount = computed(() => 
    categories.value.filter(cat => cat.is_active).length
  )

  const getCategoryById = computed(() => (id) => 
    categories.value.find(cat => cat.id === id)
  )

  const getCategoriesByType = computed(() => (type) => 
    categories.value.filter(cat => cat.type === type && cat.is_active)
  )

  // Actions
  const fetchCategories = async (options = {}) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const queryOptions = {
        filters: {
          user_id: authStore.user.id,
          ...options.filters
        },
        orderBy: {
          column: options.orderBy || 'name',
          ascending: options.ascending ?? true
        }
      }

      const data = await dbHelpers.getAll(TABLES.CATEGORIES, queryOptions)
      categories.value = data

      return data
    } catch (err) {
      error.value = err.message
      console.error('Fetch categories error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const newCategory = {
        ...categoryData,
        user_id: authStore.user.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const createdCategory = await dbHelpers.create(TABLES.CATEGORIES, newCategory)
      categories.value.push(createdCategory)

      return createdCategory
    } catch (err) {
      error.value = err.message
      console.error('Create category error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      loading.value = true
      error.value = null

      const updateData = {
        ...categoryData,
        updated_at: new Date().toISOString()
      }

      const updatedCategory = await dbHelpers.update(TABLES.CATEGORIES, id, updateData)
      
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }

      return updatedCategory
    } catch (err) {
      error.value = err.message
      console.error('Update category error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    try {
      loading.value = true
      error.value = null

      // Check if category is being used in transactions
      const { data: transactions } = await supabase
        .from(TABLES.TRANSACTIONS)
        .select('id')
        .eq('category_id', id)
        .limit(1)

      if (transactions && transactions.length > 0) {
        throw new Error('Kategori tidak dapat dihapus karena masih digunakan dalam transaksi')
      }

      await dbHelpers.delete(TABLES.CATEGORIES, id)
      
      categories.value = categories.value.filter(cat => cat.id !== id)

      return true
    } catch (err) {
      error.value = err.message
      console.error('Delete category error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleCategoryStatus = async (id) => {
    try {
      const category = categories.value.find(cat => cat.id === id)
      if (!category) throw new Error('Category not found')

      return await updateCategory(id, {
        is_active: !category.is_active
      })
    } catch (err) {
      error.value = err.message
      console.error('Toggle category status error:', err)
      throw err
    }
  }

  const initializeDefaultCategories = async () => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        console.log('User not authenticated, skipping category initialization')
        return []
      }

      // Check if user already has categories
      try {
        const existingCategories = await dbHelpers.getAll(TABLES.CATEGORIES, {
          filters: { user_id: authStore.user.id }
        })

        if (existingCategories.length > 0) {
          categories.value = existingCategories
          return existingCategories
        }
      } catch (dbError) {
        console.warn('Database not available, using mock categories:', dbError.message)
        
        // Use mock categories if database is not available
        const mockCategories = [
          { id: '1', name: 'Gaji', type: 'income', color: '#28a745', icon: 'bi-cash', is_active: true },
          { id: '2', name: 'Bonus', type: 'income', color: '#17a2b8', icon: 'bi-gift', is_active: true },
          { id: '3', name: 'Investasi', type: 'income', color: '#6f42c1', icon: 'bi-graph-up', is_active: true },
          { id: '4', name: 'Makanan', type: 'expense', color: '#fd7e14', icon: 'bi-cup-straw', is_active: true },
          { id: '5', name: 'Transport', type: 'expense', color: '#dc3545', icon: 'bi-car-front', is_active: true },
          { id: '6', name: 'Belanja', type: 'expense', color: '#e83e8c', icon: 'bi-bag', is_active: true },
          { id: '7', name: 'Hiburan', type: 'expense', color: '#6610f2', icon: 'bi-controller', is_active: true },
          { id: '8', name: 'Kesehatan', type: 'expense', color: '#20c997', icon: 'bi-heart-pulse', is_active: true }
        ]
        
        categories.value = mockCategories
        return mockCategories
      }

      // Create default categories if none exist
      const defaultCategories = []
      
      // Income categories
      const incomeCategories = DEFAULT_CATEGORIES?.INCOME || [
        { name: 'Gaji', color: '#28a745', icon: 'bi-cash' },
        { name: 'Bonus', color: '#17a2b8', icon: 'bi-gift' },
        { name: 'Investasi', color: '#6f42c1', icon: 'bi-graph-up' }
      ]
      
      for (const cat of incomeCategories) {
        defaultCategories.push({
          name: cat.name,
          type: 'income',
          color: cat.color,
          icon: cat.icon,
          user_id: authStore.user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      // Expense categories
      const expenseCategories = DEFAULT_CATEGORIES?.EXPENSE || [
        { name: 'Makanan', color: '#fd7e14', icon: 'bi-cup-straw' },
        { name: 'Transport', color: '#dc3545', icon: 'bi-car-front' },
        { name: 'Belanja', color: '#e83e8c', icon: 'bi-bag' },
        { name: 'Hiburan', color: '#6610f2', icon: 'bi-controller' },
        { name: 'Kesehatan', color: '#20c997', icon: 'bi-heart-pulse' }
      ]
      
      for (const cat of expenseCategories) {
        defaultCategories.push({
          name: cat.name,
          type: 'expense',
          color: cat.color,
          icon: cat.icon,
          user_id: authStore.user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      // Insert all categories
      try {
        const { data, error: insertError } = await supabase
          .from(TABLES.CATEGORIES)
          .insert(defaultCategories)
          .select()

        if (insertError) throw insertError

        categories.value = data
        return data
      } catch (insertError) {
        console.warn('Failed to insert categories to database, using mock data:', insertError.message)
        
        // Use mock categories with generated IDs
        const mockCategories = defaultCategories.map((cat, index) => ({
          ...cat,
          id: (index + 1).toString()
        }))
        
        categories.value = mockCategories
        return mockCategories
      }

    } catch (err) {
      error.value = err.message
      console.error('Initialize default categories error:', err)
      
      // Fallback to basic mock categories
      const fallbackCategories = [
        { id: '1', name: 'Pemasukan', type: 'income', color: '#28a745', icon: 'bi-cash', is_active: true },
        { id: '2', name: 'Pengeluaran', type: 'expense', color: '#dc3545', icon: 'bi-cart', is_active: true }
      ]
      
      categories.value = fallbackCategories
      return fallbackCategories
    } finally {
      loading.value = false
    }
  }

  const searchCategories = async (searchTerm) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const { data, error: searchError } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('user_id', authStore.user.id)
        .ilike('name', `%${searchTerm}%`)
        .order('name')

      if (searchError) throw searchError

      return data || []
    } catch (err) {
      error.value = err.message
      console.error('Search categories error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    categories.value = []
    loading.value = false
    error.value = null
  }

  // Return store interface
  return {
    // State
    categories,
    loading,
    error,
    
    // Getters
    incomeCategories,
    expenseCategories,
    activeCategoriesCount,
    getCategoryById,
    getCategoriesByType,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    initializeDefaultCategories,
    searchCategories,
    clearError,
    reset
  }
})
